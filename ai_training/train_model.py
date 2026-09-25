"""
================================================================================
REBUILD AI MATERIAL RECOGNITION ENGINE - TRAINING PIPELINE
Construction & Demolition Waste (CDW) Computer Vision Model
================================================================================
Architecture: Transfer Learning via ResNet-34 / MobileNetV3-Large
Target Classes: 8 Categories
  1. Brick
  2. Concrete
  3. Wood
  4. Metal
  5. Drywall (Gypsum)
  6. Plastic
  7. Asphalt
  8. Ceramic

Run command:
  python train_model.py --data_dir ./dataset --epochs 25 --batch_size 32 --lr 0.0003
================================================================================
"""

import os
import time
import copy
import argparse
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.optim import lr_scheduler
from torchvision import datasets, models, transforms
from sklearn.metrics import classification_report, confusion_matrix

CLASSES = [
    'Brick',
    'Concrete',
    'Metal',
    'Wood',
    'Drywall',
    'Glass',
    'Stone'
]

def get_data_transforms():
    """
    Data Augmentation for robust site condition recognition:
    Accounts for variable sun angles, dust, concrete slurry, and shadows.
    """
    data_transforms = {
        'train': transforms.Compose([
            transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
            transforms.RandomHorizontalFlip(),
            transforms.RandomVerticalFlip(p=0.2),
            transforms.RandomRotation(degrees=15),
            transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
        'val': transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
    }
    return data_transforms

def build_model(num_classes=8, model_name='resnet34', pretrained=True):
    """
    Initializes pre-trained backbone and swaps the final classification head.
    """
    print(f"[Model Init] Loading pre-trained backbone: {model_name}...")
    
    if model_name == 'resnet34':
        weights = models.ResNet34_Weights.DEFAULT if pretrained else None
        model = models.resnet34(weights=weights)
        
        # Freeze initial feature extraction layers if dataset is small (<5,000 images)
        for param in list(model.parameters())[:-12]:
            param.requires_grad = False
            
        num_ftrs = model.fc.in_features
        model.fc = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(num_ftrs, 256),
            nn.ReLU(),
            nn.BatchNorm1d(256),
            nn.Dropout(0.2),
            nn.Linear(256, num_classes)
        )
    elif model_name == 'mobilenet_v3':
        weights = models.MobileNet_V3_Large_Weights.DEFAULT if pretrained else None
        model = models.mobilenet_v3_large(weights=weights)
        num_ftrs = model.classifier[0].in_features
        model.classifier = nn.Sequential(
            nn.Linear(num_ftrs, 256),
            nn.Hardswish(),
            nn.Dropout(p=0.2),
            nn.Linear(256, num_classes),
        )
    else:
        raise ValueError(f"Unsupported model: {model_name}")

    return model

def train_model(model, dataloaders, dataset_sizes, criterion, optimizer, scheduler, device, num_epochs=25, output_path='best_cdw_model.pt'):
    since = time.time()

    best_model_wts = copy.deepcopy(model.state_dict())
    best_acc = 0.0

    print("\n" + "="*60)
    print("STARTING TRAINING LOOP")
    print(f"Device: {device} | Epochs: {num_epochs} | Training Samples: {dataset_sizes.get('train', 0)}")
    print("="*60 + "\n")

    for epoch in range(num_epochs):
        print(f"Epoch {epoch + 1}/{num_epochs}")
        print("-" * 10)

        for phase in ['train', 'val']:
            if phase == 'train':
                model.train()
            else:
                model.eval()

            running_loss = 0.0
            running_corrects = 0

            # Iterate over data batches
            for inputs, labels in dataloaders[phase]:
                inputs = inputs.to(device)
                labels = labels.to(device)

                optimizer.zero_grad()

                with torch.set_grad_enabled(phase == 'train'):
                    outputs = model(inputs)
                    _, preds = torch.max(outputs, 1)
                    loss = criterion(outputs, labels)

                    if phase == 'train':
                        loss.backward()
                        optimizer.step()

                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

            if phase == 'train' and scheduler:
                scheduler.step()

            epoch_loss = running_loss / dataset_sizes[phase]
            epoch_acc = running_corrects.double() / dataset_sizes[phase]

            print(f"{phase.capitalize()} Loss: {epoch_loss:.4f} Acc: {epoch_acc * 100:.2f}%")

            # Deep copy the best model weights
            if phase == 'val' and epoch_acc > best_acc:
                best_acc = epoch_acc
                best_model_wts = copy.deepcopy(model.state_dict())
                torch.save(model.state_dict(), output_path)
                print(f"--> [CHECKPOINT SAVED] New best validation accuracy: {best_acc * 100:.2f}%\n")

        print()

    time_elapsed = time.time() - since
    print(f"Training complete in {time_elapsed // 60:.0f}m {time_elapsed % 60:.0f}s")
    print(f"Best Validation Accuracy: {best_acc * 100:.2f}%\n")

    # Load best model weights
    model.load_state_dict(best_model_wts)
    return model

def export_onnx(model, device, output_path='cdw_model.onnx'):
    """
    Exports the trained PyTorch model to ONNX format for sub-50ms CPU/Edge deployment.
    """
    try:
        model.eval()
        dummy_input = torch.randn(1, 3, 224, 224, device=device)
        torch.onnx.export(
            model,
            dummy_input,
            output_path,
            export_params=True,
            opset_version=14,
            do_constant_folding=True,
            input_names=['input_image'],
            output_names=['class_probabilities'],
            dynamic_axes={'input_image': {0: 'batch_size'}, 'class_probabilities': {0: 'batch_size'}}
        )
        print(f"[ONNX Export] Successfully exported model to {output_path}")
    except Exception as e:
        print(f"[ONNX Notice] ONNX export skipped ({e}). Native PyTorch weights 'best_cdw_model.pt' are ready to use!")

def main():
    parser = argparse.ArgumentParser(description="Train ReBuild AI Waste Classifier")
    parser.add_argument('--data_dir', type=str, default='./dataset', help='Path to dataset directory containing train/ and val/ folders')
    parser.add_argument('--epochs', type=int, default=25, help='Number of epochs to train')
    parser.add_argument('--batch_size', type=int, default=32, help='Batch size for training')
    parser.add_argument('--lr', type=float, default=0.0003, help='Initial learning rate')
    parser.add_argument('--model', type=str, default='resnet34', choices=['resnet34', 'mobilenet_v3'], help='Model backbone architecture')
    parser.add_argument('--output', type=str, default='best_cdw_model.pt', help='Output model weights filename')
    
    args = parser.parse_args()

    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    print(f"[Hardware Setup] Active Computation Device: {device}")

    # Check if dataset directory exists
    if not os.path.exists(args.data_dir):
        print(f"\n[Warning] Dataset directory '{args.data_dir}' not found.")
        print("Please structure your dataset as:")
        print("  dataset/")
        print("    train/ [Brick, Concrete, Wood, Metal, Drywall, Plastic, Asphalt, Ceramic]")
        print("    val/   [Brick, Concrete, Wood, Metal, Drywall, Plastic, Asphalt, Ceramic]")
        print("\nSee ai_training/README.md for sample dataset download instructions.")
        return

    data_transforms = get_data_transforms()
    image_datasets = {
        x: datasets.ImageFolder(os.path.join(args.data_dir, x), data_transforms[x])
        for x in ['train', 'val']
    }

    dataloaders = {
        x: torch.utils.data.DataLoader(image_datasets[x], batch_size=args.batch_size, shuffle=(x == 'train'), num_workers=0)
        for x in ['train', 'val']
    }

    dataset_sizes = {x: len(image_datasets[x]) for x in ['train', 'val']}
    class_names = image_datasets['train'].classes
    print(f"[Dataset Loaded] Found classes: {class_names}")

    # Build model & setup loss/optimizer
    model = build_model(num_classes=len(class_names), model_name=args.model).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-4)
    exp_lr_scheduler = lr_scheduler.CosineAnnealingLR(optimizer, T_max=args.epochs, eta_min=1e-6)

    # Train
    best_model = train_model(
        model=model,
        dataloaders=dataloaders,
        dataset_sizes=dataset_sizes,
        criterion=criterion,
        optimizer=optimizer,
        scheduler=exp_lr_scheduler,
        device=device,
        num_epochs=args.epochs,
        output_path=args.output
    )

    # Export ONNX
    export_onnx(best_model, device, 'cdw_model.onnx')

if __name__ == '__main__':
    main()
