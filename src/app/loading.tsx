export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <img 
          src="/logo/memoirvault.png" 
          alt="MemoirVault Logo" 
          className="w-8 h-8 mx-auto mb-4"
        />
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004838] mx-auto mb-4"></div>
        <p className="text-[#333F3C] font-medium">Loading your private space...</p>
      </div>
    </div>
  );
}