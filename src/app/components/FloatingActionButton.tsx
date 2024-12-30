import Link from "next/link";

type FloatingActionButtonProps = {
  href: string;
  label?: string;
};

export const FloatingActionButton = ({
  href,
  label = "+",
}: FloatingActionButtonProps) => {
  return (
    <Link
      href={href}
      className="fixed bottom-20 right-4 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors"
    >
      <span className="text-2xl">{label}</span>
    </Link>
  );
};
