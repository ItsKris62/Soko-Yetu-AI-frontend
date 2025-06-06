import Link from 'next/link';
import { BookOpen, Play, FileText, ExternalLink, Download, Clock, Tag } from 'lucide-react';
import { Resource } from '@/types/api';

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const getIcon = (type: Resource['type']) => {
    switch (type) {
      case 'article':
        return <BookOpen className="w-5 h-5" />;
      case 'video':
        return <Play className="w-5 h-5" />;
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: Resource['type']) => {
    switch (type) {
      case 'article':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'video':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pdf':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(resource.type)}`}>
            {getIcon(resource.type)}
            <span className="ml-1.5 capitalize">{resource.type}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            {formatDate(resource.created_at)}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#278783] transition-colors">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {resource.description || 'No description available.'}
        </p>

        {/* Category Badge */}
        <div className="flex items-center mb-4">
          <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 text-xs font-medium text-gray-700">
            <Tag className="w-3 h-3 mr-1" />
            {resource.category}
          </div>
        </div>

        {/* Action Button */}
        <Link href={resource.url} target="_blank" rel="noopener noreferrer">
          <button className="w-full flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-[#278783] to-[#2a9d97] text-white rounded-lg hover:from-[#1f6b67] hover:to-[#228a84] transition-all duration-200 transform hover:scale-[1.02] font-medium text-sm group">
            {resource.type === 'pdf' ? (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4 mr-2" />
                {resource.type === 'video' ? 'Watch Video' : 'Read Article'}
              </>
            )}
          </button>
        </Link>
      </div>
    </div>
  );
}