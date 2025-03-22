const UserBlocked = ({ isBlocked, isSuspended }) => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h2>
            <p className="text-gray-700 mb-2">
              Your account has been <span className="font-semibold text-red-500">blocked</span> or currently <span className="font-semibold text-red-500">Suspended</span>.
            </p>
          
          <p className="text-gray-600 mt-4">
            If you believe this is a mistake, please contact our support team.
          </p>
          <a
            href="mailto:support@banksterindia.com"
            className="mt-4 inline-block bg-blue-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Contact Support
          </a>
        </div>
      </div>
    );
  };
  
  export default UserBlocked;
  