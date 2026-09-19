export function Logo() {
  return (
    <div className="flex items-center gap-2 p-4">
      <div className="bg-white  rounded-lg p-2 border border-white/20">
        <img
          src="/brand/logo.png"
          alt="Silver Surf Boards"
          className="h-8 w-auto"
        />
      </div>
    </div>
  );
}
