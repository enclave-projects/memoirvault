export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 bg-gradient-to-br from-[#004838] to-[#073127] rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-[#E2FB6C] font-bold text-sm">M</span>
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004838] mx-auto mb-4"></div>
        <p className="text-[#333F3C] font-medium">Loading your private space...</p>
      </div>
    </div>
  );
}