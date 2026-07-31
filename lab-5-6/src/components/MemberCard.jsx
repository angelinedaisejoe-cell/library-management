const MemberCard = ({ member }) => {
  const membershipColors = {
    Standard: 'from-gray-600 to-gray-700',
    Premium: 'from-primary-600 to-indigo-700',
    Gold: 'from-amber-500 to-yellow-600',
    Student: 'from-green-600 to-emerald-700',
  };

  const gradient = membershipColors[member.membershipType] || membershipColors.Standard;

  return (
    <div className="w-full max-w-md mx-auto animate-slide-up">
      <div className={`relative bg-gradient-to-br ${gradient} rounded-3xl p-6 shadow-2xl overflow-hidden`}>
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full" />

        {/* Header */}
        <div className="relative flex items-start justify-between mb-5">
          <div>
            <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-1">LibraVault</p>
            <h2 className="text-white font-black text-xl leading-tight">{member.name}</h2>
          </div>
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/30 shadow-lg flex-shrink-0">
            {member.photo ? (
              <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white">
                {member.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="relative grid grid-cols-2 gap-3 mb-5">
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider">Email</p>
            <p className="text-white text-sm font-medium truncate">{member.email}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider">Phone</p>
            <p className="text-white text-sm font-medium">{member.phone}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider">Date of Birth</p>
            <p className="text-white text-sm font-medium">{member.dob}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider">Gender</p>
            <p className="text-white text-sm font-medium">{member.gender}</p>
          </div>
        </div>

        {/* Categories */}
        {member.categories && member.categories.length > 0 && (
          <div className="relative mb-4">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Preferred Categories</p>
            <div className="flex flex-wrap gap-1.5">
              {member.categories.map(cat => (
                <span key={cat} className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="relative flex items-center justify-between mt-2 pt-4 border-t border-white/20">
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider">Membership</p>
            <p className="text-white font-bold text-base">{member.membershipType}</p>
          </div>
          <div className="text-right">
            <p className="text-white/50 text-xs uppercase tracking-wider">Member ID</p>
            <p className="text-white font-mono text-sm font-bold">#{member.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
