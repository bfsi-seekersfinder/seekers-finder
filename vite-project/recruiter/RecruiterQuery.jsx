
export default function RecruiterQuery() {
    return (
      <div className="min-h-screen flex bg-gray-100 p-8">
        {/* Left Section - TalentX Info */}
        <div className="w-1/2 p-6">
          <h2 className="text-2xl font-bold text-gray-800">Talent<span className="text-orange-500">X</span></h2>
          <p className="mt-4 text-slate-700 font-sans">
            TalentX is a professional recruiting platform where you can find the perfect candidates and employees that fit your requirements. Our mission is to connect businesses with top talent efficiently and effectively.
          </p>
          <div className=" py-4 flex h-[400px] justify-center items-center ">
            <img src="\images\job-interview-conversation.png" alt="" className="h-full w-[400px] "/>
          </div>
        </div>
        
        {/* Right Section - User Form */}
        <div className="w-1/2 p-6 text-slate-600  shadow-lg ml-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recruiter Query</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Your Name</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-300 focus:outline-none required" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Company Name</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-300 focus:outline-none" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Designation</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-300 focus:outline-none" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Contact No</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-300 focus:outline-none" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input type="email" className="w-full px-4 py-2 border border-slate-300 focus:outline-none" required />
            </div>
            <button type="submit" className="w-full bg-emerald-500 text-white py-2   hover:bg-emerald-600 transition">Submit</button>
          </form>
        </div>
      </div>
    );
  }
  