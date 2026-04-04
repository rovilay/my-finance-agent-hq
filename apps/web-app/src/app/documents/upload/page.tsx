import { redirect } from 'next/navigation';
import { ENTITIES_ROUTE } from '@/lib/constants';

export default function Upload() {
  redirect(ENTITIES_ROUTE);
}
