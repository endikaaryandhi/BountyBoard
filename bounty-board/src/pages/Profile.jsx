export default function Profile() {
  return (
    <div className="p-4 pb-20 min-h-screen bg-stone-100 flex flex-col items-center">
      <div className="w-32 h-32 bg-wood rounded-full mb-4 overflow-hidden border-4 border-paper">
        <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Hunter" alt="Avatar" />
      </div>
      <h2 className="text-2xl font-bold text-wood">Hunter Name: Ranger</h2>
      <p className="text-gray-600">Rank: S-Class</p>
      
      <div className="mt-8 bg-white p-4 rounded shadow w-full">
        <h3 className="font-bold mb-2">About Application</h3>
        <p>BountyBoard v1.0</p>
        <p>Database buronan terintegrasi untuk memudahkan para pemburu hadiah.</p>
      </div>
    </div>
  );
}