const EditPanel = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-lg py-2 z-40`}
      >
        {children}
      </div>
    </>
  );
};

export default EditPanel;
