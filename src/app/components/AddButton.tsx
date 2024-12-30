"use client";

interface AddButtonProps {
  onClick?: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl z-10"
    >
      +
    </button>
  );
};

export default AddButton;
