import React from "react";
import { motion } from "motion/react";
import { Upload, FileText } from "lucide-react";
import clsx from "clsx";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
  fileType?: string;
  maxSizeMB?: number;
  accept?: string;
  title?: string;
  description?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  isAnalyzing,
  fileType = "PDF, DOCX, and TXT",
  maxSizeMB = 25,
  accept = ".pdf,.docx,.txt",
  title = "Drag & Drop or Click",
  description,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) onFileSelect(droppedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 bg-white rounded-3xl border-2 border-dashed border-stone-200 hover:border-coffee/50 transition-colors relative flex flex-col items-center justify-center p-12 text-center group min-h-100"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        onChange={handleFileChange}
        disabled={isAnalyzing}
      />

      {isAnalyzing ? (
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-24 h-24">
            <svg
              className="animate-spin w-full h-full text-coffee/20"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              ></circle>
              <path
                className="opacity-75 text-coffee"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <FileText
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-charcoal"
              size={32}
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-charcoal">
              Analyzing Document...
            </h3>
            <p className="text-charcoal/50">Extracting clauses and entities</p>
          </div>
        </div>
      ) : (
        <>
          <div
            className={clsx(
              "w-20 h-20 rounded-full bg-stone-50 flex items-center justify-center mb-6 transition-transform duration-300",
              isDragging && "scale-110 bg-coffee/10"
            )}
          >
            <Upload
              className={clsx(
                "text-charcoal/40 group-hover:text-coffee transition-colors",
                isDragging && "text-coffee"
              )}
              size={32}
            />
          </div>
          <h3 className="text-2xl font-serif text-charcoal mb-2">
            {isDragging ? "Drop to Upload" : title}
          </h3>
          <p className="text-charcoal/50 max-w-xs mx-auto">
            {description ||
              `Supports ${fileType} files up to ${maxSizeMB}MB. All uploads are encrypted.`}
          </p>
        </>
      )}
    </motion.div>
  );
};
