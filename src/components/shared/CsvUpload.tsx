import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Info, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';

interface CsvUploadProps {
  onUpload: (data: any[]) => void;
  requiredHeaders: string[];
  templateName?: string;
  instructions?: string[];
}

export function CsvUpload({
  onUpload,
  requiredHeaders,
  templateName = "template.csv",
  instructions = [
    "Ensure the file is in .csv format",
    "Headers must match the required format exactly",
    "Maximum file size: 10MB"
  ]
}: CsvUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').map(row => row.split(',').map(cell => cell.trim()));
      
      if (rows.length < 1) {
        setError('The file is empty.');
        setIsProcessing(false);
        return;
      }

      const fileHeaders = rows[0];
      const missingHeaders = requiredHeaders.filter(h => !fileHeaders.includes(h));

      if (missingHeaders.length > 0) {
        setError(`Missing required headers: ${missingHeaders.join(', ')}`);
        setIsProcessing(false);
        return;
      }

      setHeaders(fileHeaders);
      // Preview first 5 rows
      const data = rows.slice(1, 6).filter(row => row.length === fileHeaders.length);
      setPreviewData(data);
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const handleConfirm = () => {
    if (!file) return;
    
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').map(row => row.split(',').map(cell => cell.trim()));
      const fileHeaders = rows[0];
      const data = rows.slice(1)
        .filter(row => row.length === fileHeaders.length && row.some(cell => cell !== ""))
        .map(row => {
          const obj: any = {};
          fileHeaders.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        });
      
      onUpload(data);
      reset();
    };
    reader.readAsText(file);
  };

  const reset = () => {
    setFile(null);
    setPreviewData([]);
    setHeaders([]);
    setError(null);
    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-blue-700 mb-2">
          <Info size={16} />
          <span className="text-xs font-black uppercase tracking-wider">Upload Instructions</span>
        </div>
        <ul className="space-y-1">
          {instructions.map((inst, i) => (
            <li key={i} className="text-[11px] text-blue-600 flex items-start gap-2">
              <span className="mt-1 w-1 h-1 rounded-full bg-blue-400 shrink-0" />
              {inst}
            </li>
          ))}
          <li className="text-[11px] text-blue-600 flex items-start gap-2">
            <span className="mt-1 w-1 h-1 rounded-full bg-blue-400 shrink-0" />
            Required Headers: <span className="font-mono font-bold">{requiredHeaders.join(', ')}</span>
          </li>
        </ul>
      </div>

      {!file ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 rounded-[24px] p-12 flex flex-col items-center justify-center gap-4 hover:border-[#E3624A] hover:bg-orange-50/30 transition-all cursor-pointer group"
        >
          <div className="p-4 bg-slate-50 rounded-full text-slate-400 group-hover:bg-[#E3624A] group-hover:text-white transition-all">
            <Upload size={32} />
          </div>
          <div className="text-center">
            <p className="text-sm font-black text-[#111f42] uppercase tracking-widest">Click to upload CSV</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">or drag and drop your file here</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".csv" 
            onChange={handleFileChange} 
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg text-[#E3624A] shadow-sm">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-xs font-black text-[#111f42] uppercase tracking-wider">{file.name}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button onClick={reset} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
              <X size={18} />
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600">
              <AlertCircle size={18} />
              <p className="text-xs font-bold">{error}</p>
            </div>
          )}

          {!error && previewData.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Data Preview (First 5 rows)</p>
              <div className="border border-slate-100 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left text-[10px]">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        {headers.map((h, i) => (
                          <th key={i} className="px-4 py-2 font-black text-[#111f42] uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {previewData.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell: any, j: number) => (
                            <th key={j} className="px-4 py-2 font-medium text-slate-600 whitespace-nowrap">{cell}</th>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-[#111f42] text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#111f42]/90 transition-all disabled:opacity-50"
              >
                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                Confirm and Upload
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
