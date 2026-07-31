import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MemberCard from '../components/MemberCard';

const CATEGORIES = ['Fiction', 'Science', 'History', 'Technology', 'Biography', 'Fantasy', 'Mystery', 'Self-Help'];
const MEMBERSHIP_TYPES = ['Standard', 'Premium', 'Gold', 'Student'];
const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

const emptyForm = {
  name: '',
  email: '',
  password: '',
  dob: '',
  gender: '',
  membershipType: 'Standard',
  phone: '',
  categories: [],
  address: '',
  photo: null,
};

let nextId = 1001;

const Register = () => {
  const [formData, setFormData] = useState({ ...emptyForm });
  const [errors, setErrors] = useState({});
  const [members, setMembers] = useState([]);
  const [previewMember, setPreviewMember] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle regular input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Handle checkbox change for categories
  const handleCategoryChange = (cat) => {
    setFormData(prev => {
      const cats = prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat];
      return { ...prev, categories: cats };
    });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      setFormData(prev => ({ ...prev, photo: url }));
    }
  };

  // Validation
  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Invalid email format.';
    }
    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Minimum 6 characters.';
    }
    if (!formData.dob) errs.dob = 'Date of birth is required.';
    if (!formData.gender) errs.gender = 'Please select a gender.';
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^\+?[\d\s\-]{7,15}$/.test(formData.phone)) {
      errs.phone = 'Invalid phone number.';
    }
    if (!formData.address.trim()) errs.address = 'Address is required.';
    return errs;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editingId !== null) {
      // Update existing member
      const updated = { ...formData, id: editingId };
      setMembers(prev => prev.map(m => m.id === editingId ? updated : m));
      setPreviewMember(updated);
      setEditingId(null);
    } else {
      // Add new member
      const newMember = { ...formData, id: nextId++ };
      setMembers(prev => [...prev, newMember]);
      setPreviewMember(newMember);
    }

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setFormData({ ...emptyForm });
    setPhotoPreview(null);
    setErrors({});
  };

  // Start editing a member
  const handleEdit = (member) => {
    setFormData({ ...member });
    setPhotoPreview(member.photo || null);
    setEditingId(member.id);
    setPreviewMember(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete a member
  const handleDelete = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    if (previewMember?.id === id) setPreviewMember(null);
  };

  const InputError = ({ field }) =>
    errors[field] ? (
      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {errors[field]}
      </p>
    ) : null;

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="section-title">Member Registration</h1>
          <p className="section-subtitle">Fill in the details to register as a library member</p>
        </div>

        {/* Success toast */}
        {showSuccess && (
          <div className="fixed top-20 right-4 z-50 bg-green-500/20 border border-green-500/40 text-green-300 px-5 py-3 rounded-xl flex items-center gap-2 shadow-xl animate-slide-up">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {editingId ? 'Member updated successfully!' : 'Member registered successfully!'}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <div className="card p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-7 h-7 bg-primary-600/20 rounded-lg flex items-center justify-center text-primary-400 text-sm">👤</span>
                {editingId ? 'Edit Member' : 'New Member Details'}
              </h2>

              <form onSubmit={handleSubmit} noValidate id="register-form">
                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="reg-name" className="label">Full Name *</label>
                    <input
                      id="reg-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                    />
                    <InputError field="name" />
                  </div>
                  <div>
                    <label htmlFor="reg-email" className="label">Email Address *</label>
                    <input
                      id="reg-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                    />
                    <InputError field="email" />
                  </div>
                </div>

                {/* Password + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="reg-password" className="label">Password *</label>
                    <input
                      id="reg-password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 6 characters"
                      className={`input-field ${errors.password ? 'border-red-500' : ''}`}
                    />
                    <InputError field="password" />
                  </div>
                  <div>
                    <label htmlFor="reg-phone" className="label">Phone Number *</label>
                    <input
                      id="reg-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                      className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    <InputError field="phone" />
                  </div>
                </div>

                {/* DOB + Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="reg-dob" className="label">Date of Birth *</label>
                    <input
                      id="reg-dob"
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className={`input-field ${errors.dob ? 'border-red-500' : ''}`}
                    />
                    <InputError field="dob" />
                  </div>
                  <div>
                    <label htmlFor="reg-gender" className="label">Gender *</label>
                    <select
                      id="reg-gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`input-field ${errors.gender ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select gender</option>
                      {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <InputError field="gender" />
                  </div>
                </div>

                {/* Membership Type */}
                <div className="mb-4">
                  <label className="label">Membership Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {MEMBERSHIP_TYPES.map(type => (
                      <label
                        key={type}
                        className={`cursor-pointer rounded-xl p-3 border text-center text-sm font-medium transition-all duration-200 ${
                          formData.membershipType === type
                            ? 'bg-primary-600/20 border-primary-500 text-primary-300'
                            : 'bg-dark-800 border-white/10 text-gray-400 hover:border-white/30'
                        }`}
                      >
                        <input
                          type="radio"
                          name="membershipType"
                          value={type}
                          checked={formData.membershipType === type}
                          onChange={handleChange}
                          className="sr-only"
                          id={`membership-${type}`}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Preferred Categories */}
                <div className="mb-4">
                  <label className="label">Preferred Categories</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CATEGORIES.map(cat => (
                      <label
                        key={cat}
                        className={`flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 border text-sm transition-all duration-200 ${
                          formData.categories.includes(cat)
                            ? 'bg-primary-600/20 border-primary-500/50 text-primary-300'
                            : 'bg-dark-800 border-white/10 text-gray-400 hover:border-white/30'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.categories.includes(cat)}
                          onChange={() => handleCategoryChange(cat)}
                          className="accent-primary-500 w-3.5 h-3.5"
                          id={`cat-${cat}`}
                        />
                        {cat}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div className="mb-4">
                  <label htmlFor="reg-address" className="label">Address *</label>
                  <textarea
                    id="reg-address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St, City, State, ZIP"
                    rows={3}
                    className={`input-field resize-none ${errors.address ? 'border-red-500' : ''}`}
                  />
                  <InputError field="address" />
                </div>

                {/* Photo Upload */}
                <div className="mb-6">
                  <label htmlFor="reg-photo" className="label">Profile Photo</label>
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="reg-photo"
                      className="flex items-center gap-2 cursor-pointer bg-dark-800 border border-dashed border-white/20 hover:border-primary-500/50 text-gray-400 hover:text-primary-400 rounded-xl px-4 py-3 text-sm transition-all duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Upload Photo
                    </label>
                    <input
                      id="reg-photo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {photoPreview && (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-14 h-14 rounded-xl object-cover border border-white/20"
                      />
                    )}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                  <button
                    id="register-submit-btn"
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    {editingId ? '✏️ Update Member' : '✅ Register Member'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...emptyForm });
                        setPhotoPreview(null);
                        setEditingId(null);
                        setErrors({});
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Right Sidebar: Member Card Preview */}
          <div className="space-y-6">
            {previewMember ? (
              <div>
                <h2 className="text-lg font-bold text-white mb-4 text-center">✅ Member Card</h2>
                <MemberCard member={previewMember} />
              </div>
            ) : (
              <div className="card p-8 text-center">
                <div className="text-4xl mb-3">🪪</div>
                <p className="text-gray-500 text-sm">Your member card will appear here after registration.</p>
              </div>
            )}
          </div>
        </div>

        {/* Registered Members Table */}
        {members.length > 0 && (
          <div className="mt-12">
            <h2 className="section-title text-xl mb-6">
              📋 Registered Members ({members.length})
            </h2>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-dark-800/80 border-b border-white/10">
                      <th className="text-left text-gray-400 font-semibold px-4 py-3">#ID</th>
                      <th className="text-left text-gray-400 font-semibold px-4 py-3">Name</th>
                      <th className="text-left text-gray-400 font-semibold px-4 py-3">Email</th>
                      <th className="text-left text-gray-400 font-semibold px-4 py-3">Phone</th>
                      <th className="text-left text-gray-400 font-semibold px-4 py-3">Membership</th>
                      <th className="text-left text-gray-400 font-semibold px-4 py-3">Gender</th>
                      <th className="text-center text-gray-400 font-semibold px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member, idx) => (
                      <tr
                        key={member.id}
                        className={`border-b border-white/5 hover:bg-white/5 transition-colors ${idx % 2 === 0 ? '' : 'bg-dark-800/20'}`}
                      >
                        <td className="px-4 py-3 text-gray-500 font-mono">#{member.id}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {member.photo ? (
                              <img src={member.photo} alt={member.name} className="w-7 h-7 rounded-lg object-cover" />
                            ) : (
                              <div className="w-7 h-7 bg-primary-600/30 rounded-lg flex items-center justify-center text-primary-400 font-bold text-xs">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="text-white font-medium">{member.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-400">{member.email}</td>
                        <td className="px-4 py-3 text-gray-400">{member.phone}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            member.membershipType === 'Gold' ? 'bg-amber-500/20 text-amber-300' :
                            member.membershipType === 'Premium' ? 'bg-primary-600/20 text-primary-300' :
                            member.membershipType === 'Student' ? 'bg-green-600/20 text-green-300' :
                            'bg-gray-600/20 text-gray-300'
                          }`}>
                            {member.membershipType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">{member.gender}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(member)}
                              id={`edit-member-${member.id}`}
                              className="text-xs bg-primary-600/20 text-primary-400 hover:bg-primary-600/40 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(member.id)}
                              id={`delete-member-${member.id}`}
                              className="text-xs bg-red-500/20 text-red-400 hover:bg-red-500/40 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Register;
