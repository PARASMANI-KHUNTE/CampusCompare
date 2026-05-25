import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { adminService } from '../../services/admin.service';
import toast from 'react-hot-toast';
import { UploadCloud, FileJson, AlertCircle, CheckCircle2, RefreshCw, HelpCircle, Download } from 'lucide-react';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ImportSummary {
  total: number;
  created: number;
  skipped: number;
  failed: number;
}

interface ImportResultItem {
  name: string;
  status: 'created' | 'skipped' | 'failed';
  reason?: string;
}

export const BulkImportModal = ({ isOpen, onClose }: BulkImportModalProps) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[] | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showFormatHelp, setShowFormatHelp] = useState(false);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [resultsList, setResultsList] = useState<ImportResultItem[] | null>(null);

  const importMutation = useMutation({
    mutationFn: (colleges: any[]) => adminService.bulkImportColleges(colleges),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-colleges'] });
      toast.success('Bulk import process completed!');
      setImportSummary(data.summary);
      setResultsList(data.results);
      setFile(null);
      setParsedData(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Bulk import failed');
    },
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile: File) => {
    if (selectedFile.type !== 'application/json' && !selectedFile.name.endsWith('.json')) {
      setValidationError('Please select a valid JSON file.');
      setFile(null);
      setParsedData(null);
      return;
    }

    setFile(selectedFile);
    setValidationError(null);
    setImportSummary(null);
    setResultsList(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const colleges = json.colleges || json;
        
        if (!Array.isArray(colleges)) {
          setValidationError('JSON must contain a list of colleges (either as a root array or a {"colleges": [...]} object).');
          setParsedData(null);
          return;
        }

        if (colleges.length === 0) {
          setValidationError('The colleges array is empty.');
          setParsedData(null);
          return;
        }

        // Basic validation check
        const invalidItem = colleges.find(c => !c.name || !c.city || !c.state || !c.collegeType);
        if (invalidItem) {
          setValidationError('Validation error: All colleges must have at least "name", "city", "state", and "collegeType".');
          setParsedData(null);
          return;
        }

        setParsedData(colleges);
        setValidationError(null);
      } catch (err) {
        setValidationError('Invalid JSON syntax. Please check your file formatting.');
        setParsedData(null);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleImport = () => {
    if (parsedData) {
      importMutation.mutate(parsedData);
    }
  };

  const handleReset = () => {
    setFile(null);
    setParsedData(null);
    setValidationError(null);
    setImportSummary(null);
    setResultsList(null);
  };

  const isPending = importMutation.isPending;

  const downloadTemplate = () => {
    const template = {
      colleges: [
        {
          name: "Example University",
          shortName: "EU",
          description: "A premier institution focused on excellence in education.",
          overview: "Founded in 2000, Example University offers world-class programs.",
          city: "Mumbai",
          state: "Maharashtra",
          address: "123 University Road, Mumbai",
          collegeType: "PRIVATE",
          ownership: "Private",
          establishedYear: 2000,
          approvedBy: ["AICTE", "UGC"],
          affiliatedTo: "Mumbai University",
          accreditation: ["NAAC A"],
          imageUrl: "https://example.edu/image.jpg",
          officialUrl: "https://example.edu",
          gallery: [],
          feesMin: 150000,
          feesMax: 300000,
          rating: 4.2,
          reviewCount: 0,
          placementAverage: 800000,
          placementHighest: 2000000,
          examsAccepted: ["JEE Main", "JEE Advanced"],
          popularCourses: ["B.Tech CSE", "B.Tech ECE"],
          facilities: ["Hostel", "Library", "Sports Complex", "Cafeteria"],
          tags: ["Engineering", "Top Ranked"],
          courses: [
            {
              name: "B.Tech Computer Science",
              category: "Engineering",
              degree: "B.Tech",
              duration: "4 Years",
              fees: 200000,
              eligibility: "10+2 with PCM, min 75%",
              examsAccepted: ["JEE Main"],
              seats: 120
            }
          ]
        }
      ]
    };

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'colleges_template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => {
        handleReset();
        onClose();
      }} 
      title="Bulk Import Colleges"
      size="lg"
    >
      <div className="space-y-4">
        {/* Help section */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <button 
            type="button"
            onClick={() => setShowFormatHelp(!showFormatHelp)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-primary-600 transition-colors w-full text-left"
          >
            <HelpCircle className="w-4 h-4 text-primary-500" />
            <span>How should the JSON file be structured?</span>
            <span className="ml-auto text-xs text-gray-400">{showFormatHelp ? 'Hide' : 'Show'}</span>
          </button>
          <button
            type="button"
            onClick={downloadTemplate}
            className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-800 hover:underline transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download Template JSON
          </button>
          
          {showFormatHelp && (
            <div className="mt-3 text-xs text-gray-600 space-y-2 border-t border-gray-200 pt-3">
              <p>Your JSON file should contain a list of college objects under a <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-primary-600">"colleges"</code> key. Example structure:</p>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto font-mono text-[11px] leading-relaxed max-h-48">
{`{
  "colleges": [
    {
      "name": "Example University",
      "shortName": "EU",
      "city": "Mumbai",
      "state": "Maharashtra",
      "collegeType": "PRIVATE", 
      "establishedYear": 2015,
      "feesMin": 150000,
      "feesMax": 300000,
      "rating": 4.2,
      "reviewCount": 12,
      "placementAverage": 800000,
      "examsAccepted": ["JEE Main"],
      "popularCourses": ["B.Tech CSE"],
      "facilities": ["Hostel", "Library"],
      "tags": ["Engineering"],
      "approvedBy": ["AICTE"],
      "accreditation": ["NAAC A"],
      "officialUrl": "https://example.edu",
      "courses": [
        {
          "name": "B.Tech Computer Science",
          "category": "Engineering",
          "degree": "B.Tech",
          "duration": "4 Years",
          "fees": 150000,
          "examsAccepted": ["JEE Main"]
        }
      ]
    }
  ]
}`}
              </pre>
              <p className="text-[10px] text-gray-400">Supported collegeType values: <code className="bg-gray-100 px-1 rounded">GOVERNMENT</code>, <code className="bg-gray-100 px-1 rounded">PRIVATE</code>, <code className="bg-gray-100 px-1 rounded">DEEMED</code>, <code className="bg-gray-100 px-1 rounded">AUTONOMOUS</code>.</p>
            </div>
          )}
        </div>

        {/* Results summary (after upload completes) */}
        {importSummary && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-gray-50 border border-gray-100 p-3.5 rounded-xl text-center shadow-sm">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Total</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{importSummary.total}</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl text-center shadow-sm">
                <p className="text-[10px] text-emerald-600 uppercase tracking-wider font-semibold">Created</p>
                <p className="text-xl font-bold text-emerald-800 mt-1">{importSummary.created}</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-xl text-center shadow-sm">
                <p className="text-[10px] text-amber-600 uppercase tracking-wider font-semibold">Skipped</p>
                <p className="text-xl font-bold text-amber-800 mt-1">{importSummary.skipped}</p>
              </div>
              <div className="bg-red-50 border border-red-100 p-3.5 rounded-xl text-center shadow-sm">
                <p className="text-[10px] text-red-600 uppercase tracking-wider font-semibold">Failed</p>
                <p className="text-xl font-bold text-red-800 mt-1">{importSummary.failed}</p>
              </div>
            </div>

            {resultsList && resultsList.length > 0 && (
              <div className="border border-gray-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-100 sticky top-0">
                    <tr>
                      <th className="p-2.5 font-semibold text-gray-500">College Name</th>
                      <th className="p-2.5 font-semibold text-gray-500 w-20">Status</th>
                      <th className="p-2.5 font-semibold text-gray-500">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsList.map((res, i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                        <td className="p-2.5 font-medium text-gray-900 truncate max-w-[200px]">{res.name}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] uppercase ${
                            res.status === 'created' ? 'bg-emerald-50 text-emerald-700' :
                            res.status === 'skipped' ? 'bg-amber-50 text-amber-700' :
                            'bg-red-50 text-red-700'
                          }`}>
                            {res.status}
                          </span>
                        </td>
                        <td className="p-2.5 text-gray-500 truncate max-w-[200px]">
                          {res.status === 'skipped' ? 'Already exists' : res.reason || 'Success'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="flex justify-end pt-2">
              <Button type="button" onClick={handleReset}>Upload Another File</Button>
            </div>
          </div>
        )}

        {/* Drag and Drop Zone */}
        {!importSummary && (
          <div className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                file 
                  ? 'border-primary-400 bg-primary-50/20 hover:bg-primary-50/40' 
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".json,application/json"
              />

              {file ? (
                <FileJson className="w-12 h-12 text-primary-500 mb-3 animate-pulse" />
              ) : (
                <UploadCloud className="w-12 h-12 text-gray-400 mb-3" />
              )}

              <p className="text-sm font-semibold text-gray-900 text-center">
                {file ? file.name : 'Drag & drop your colleges.json here'}
              </p>
              <p className="text-xs text-gray-500 text-center mt-1">
                {file ? `${(file.size / 1024).toFixed(2)} KB` : 'or click to browse from files'}
              </p>
            </div>

            {/* Parsing error warning */}
            {validationError && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2.5 text-red-700 text-xs leading-normal">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Parsed colleges info */}
            {parsedData && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <div className="flex-grow">
                  <p className="text-xs font-semibold text-emerald-800">File loaded successfully!</p>
                  <p className="text-[11px] text-emerald-600 mt-0.5">Parsed {parsedData.length} colleges ready for bulk import.</p>
                </div>
                <Button 
                  onClick={handleImport} 
                  isLoading={isPending} 
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isPending ? 'animate-spin' : ''}`} />
                  Import
                </Button>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  handleReset();
                  onClose();
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
