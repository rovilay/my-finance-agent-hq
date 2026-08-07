import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';

export const BackButton = ({ onClick, text }: { onClick: () => void; text: string }) => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
    >
      <ArrowLeft className="w-4 h-4" />
      {text}
    </Button>
  );
};
