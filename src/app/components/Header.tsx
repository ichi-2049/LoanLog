interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-4 z-10">
      <h1 className="text-center text-lg">{title}</h1>
    </header>
  );
};

export default Header;