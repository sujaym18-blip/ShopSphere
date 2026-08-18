import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({ 
  icon: Icon = Package, 
  title = 'No items found', 
  message = 'There are no items to display.',
  actionLabel,
  actionLink
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{message}</p>
      {actionLabel && actionLink && (
        <Link to={actionLink} className="btn btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
