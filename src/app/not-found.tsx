import Link from 'next/link';
import Image from 'next/image';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral flex items-center justify-center">
      <div className="text-center space-y-6 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-secondary">404 - Page Not Found</h1>
        <p className="text-lg text-secondary">Oops! It looks like you’ve wandered off the farm. Let’s get you back on track.</p>
        <Image
          src="https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1741676266/Home-images/mndpqninjcp8e4nkumxe"
          alt="Lost farm illustration"
          width={300}
          height={200}
          className="mx-auto rounded-lg"
        />
        <Link href="/">
          <Button variant="primary" size="lg" className="hover:scale-105">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
