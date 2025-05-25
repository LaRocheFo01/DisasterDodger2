import { useState, useCallback } from "react";
import { Camera, X, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PhotoUploadProps {
  onPhotosChange: (photos: File[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
}

export default function PhotoUpload({ 
  onPhotosChange, 
  maxFiles = 5, 
  maxFileSize = 10 
}: PhotoUploadProps) {
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const updatePhotos = useCallback((newPhotos: File[]) => {
    setUploadedPhotos(newPhotos);
    onPhotosChange(newPhotos);
  }, [onPhotosChange]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];

    fileArray.forEach(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return;
      }

      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum ${maxFileSize}MB per file.`);
        return;
      }

      // Check total files limit
      if (uploadedPhotos.length + validFiles.length >= maxFiles) {
        alert(`Maximum ${maxFiles} photos allowed`);
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      const newPhotos = [...uploadedPhotos, ...validFiles];
      updatePhotos(newPhotos);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    handleFiles(e.dataTransfer.files);
  }, [uploadedPhotos, maxFiles, maxFileSize]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removePhoto = (index: number) => {
    const newPhotos = uploadedPhotos.filter((_, i) => i !== index);
    updatePhotos(newPhotos);
  };

  const triggerFileInput = () => {
    document.getElementById('photo-input')?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <Card 
        className={`border-2 border-dashed transition-colors cursor-pointer photo-upload-zone ${
          dragActive ? 'border-fema-blue bg-blue-50' : 'border-gray-300 hover:border-fema-blue'
        }`}
        onClick={triggerFileInput}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Camera className="text-gray-400 h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Photos</h3>
          <p className="text-gray-600 mb-4">Drag and drop files here, or click to browse</p>
          <p className="text-sm text-gray-500">
            Maximum {maxFiles} files • JPG, PNG, HEIC up to {maxFileSize}MB each
          </p>
          <input
            id="photo-input"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Photo Previews */}
      {uploadedPhotos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploadedPhotos.map((photo, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(photo)}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 w-6 h-6 p-0 rounded-full"
              >
                <X className="h-3 w-3" />
              </Button>
              <div className="text-xs text-gray-600 mt-1 truncate">
                {photo.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
