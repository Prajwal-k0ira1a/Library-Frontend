import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle, AlertCircle, Star, Sparkles, Users, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [animateElements, setAnimateElements] = useState(false);

  useEffect(() => {
    setAnimateElements(true);
  }, []);

  // Input sanitization function
  const sanitizeInput = (value) => {
    return value.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  };

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    
    if (!form.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (form.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!form.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (form.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    
    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(form.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!form.subject.trim()) {
      errors.subject = 'Subject is required';
    } else if (form.subject.trim().length < 5) {
      errors.subject = 'Subject must be at least 5 characters';
    }
    
    if (!form.message.trim()) {
      errors.message = 'Message is required';
    } else if (form.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setForm({ ...form, [name]: sanitizedValue });
    setError('');
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fix the errors below');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Simulate API call with potential failure
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random failure for testing
          if (Math.random() < 0.1) {
            reject(new Error('Network error'));
          } else {
            resolve();
          }
        }, 2000);
      });

      console.log('Form submitted:', form);
      setIsSubmitted(true);
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setError('Failed to send message. Please check your connection and try again.');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setError('');
    setFieldErrors({});
  };

  const getInputClassName = (fieldName) => {
    const baseClasses = "w-full px-6 py-4 rounded-2xl border-2 focus:ring-4 outline-none transition-all duration-300 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-500 font-medium";
    const errorClasses = "border-red-400 focus:border-red-500 focus:ring-red-500/30 shadow-lg shadow-red-500/10";
    const normalClasses = "border-gray-200/60 focus:border-indigo-400 focus:ring-indigo-500/30 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10";
    
    return `${baseClasses} ${fieldErrors[fieldName] ? errorClasses : normalClasses}`;
  };

  const stats = [
    { icon: Users, label: "Happy Customers", value: "50K+" },
    { icon: MessageSquare, label: "Messages Handled", value: "25K+" },
    { icon: Star, label: "Average Rating", value: "4.9" },
  ];

  return (
    <section
      id="contact-us"
      className="relative py-32 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden min-h-screen"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%236366f1%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className={`text-center mb-24 transition-all duration-1000 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-3xl mb-8 shadow-2xl shadow-indigo-500/30 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-3xl animate-spin opacity-75 blur-sm"></div>
            <Mail className="h-10 w-10 text-white relative z-10" />
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-bounce" />
          </div>
          <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 tracking-tight">
            Let's Create Magic
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
            Transform your ideas into reality. We're here to make extraordinary things happen together.
          </p>
        </div>

        {/* Stats Section */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 transition-all duration-1000 delay-200 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/60 backdrop-blur-lg p-6 rounded-3xl shadow-xl border border-white/30 text-center hover:transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Enhanced Left Side Contact Info */}
          <div className={`lg:col-span-2 space-y-8 transition-all duration-1000 delay-400 ${animateElements ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            {/* Email */}
            <div className="group bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="flex items-start space-x-6 relative z-10">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-3xl shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-xl text-gray-900 mb-3">Email Us</h4>
                  <p className="text-gray-700 mb-2 text-lg">
                    <a href="mailto:support@libraryhub.com" className="hover:text-indigo-600 transition-colors font-medium">
                      support@libraryhub.com
                    </a>
                  </p>
                  <p className="text-gray-700 text-lg">
                    <a href="mailto:info@libraryhub.com" className="hover:text-indigo-600 transition-colors font-medium">
                      info@libraryhub.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="group bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="flex items-start space-x-6 relative z-10">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-700 p-4 rounded-3xl shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-xl text-gray-900 mb-3">Call Us</h4>
                  <p className="text-gray-700 mb-2 text-lg">
                    <a href="tel:+15551234567" className="hover:text-indigo-600 transition-colors font-medium">
                      +1 (555) 123-4567
                    </a>
                  </p>
                  <p className="text-gray-700 text-lg">
                    <a href="tel:+15559876543" className="hover:text-indigo-600 transition-colors font-medium">
                      +1 (555) 987-6543
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="group bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="flex items-start space-x-6 relative z-10">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-3xl shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-xl text-gray-900 mb-3">Visit Us</h4>
                  <p className="text-gray-700 mb-2 text-lg font-medium">123 Library Street</p>
                  <p className="text-gray-700 text-lg font-medium">Knowledge City, KC 12345</p>
                </div>
              </div>
            </div>

            {/* Enhanced Office Hours */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="flex items-center space-x-4 mb-6 relative z-10">
                <Clock className="h-8 w-8" />
                <h4 className="font-bold text-2xl">Office Hours</h4>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
                  <span className="text-indigo-100 font-medium text-lg">Monday - Friday</span>
                  <span className="font-bold text-lg">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
                  <span className="text-indigo-100 font-medium text-lg">Saturday</span>
                  <span className="font-bold text-lg">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
                  <span className="text-indigo-100 font-medium text-lg">Sunday</span>
                  <span className="font-bold text-lg">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Right Side Form */}
          <div className={`lg:col-span-3 transition-all duration-1000 delay-600 ${animateElements ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="bg-white/80 backdrop-blur-xl p-10 lg:p-12 rounded-3xl shadow-2xl border border-white/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
              <div className="relative z-10">
                <div className="text-center mb-10">
                  <h3 className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                    Send us a Message
                  </h3>
                  <p className="text-gray-600 text-lg font-medium">We'd love to hear from you. Drop us a line!</p>
                </div>

                {isSubmitted ? (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 relative">
                      <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-25"></div>
                      <CheckCircle className="h-12 w-12 text-green-600 relative z-10" />
                    </div>
                    <h4 className="text-3xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h4>
                    <p className="text-gray-600 mb-8 text-lg">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                    <button
                      onClick={resetForm}
                      className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {error && (
                      <div className="flex items-center space-x-4 p-6 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 animate-pulse">
                        <AlertCircle className="h-6 w-6 flex-shrink-0" />
                        <span className="font-medium text-lg">{error}</span>
                      </div>
                    )}

                    {/* Name fields */}
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="group">
                        <label 
                          htmlFor="firstName" 
                          className="block text-lg font-bold text-gray-800 mb-3 group-focus-within:text-indigo-600 transition-colors"
                        >
                          First Name *
                        </label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={form.firstName}
                          onChange={handleChange}
                          className={getInputClassName('firstName')}
                          placeholder="John"
                          aria-describedby={fieldErrors.firstName ? "firstName-error" : undefined}
                          aria-invalid={!!fieldErrors.firstName}
                          maxLength={50}
                        />
                        {fieldErrors.firstName && (
                          <p id="firstName-error" className="mt-3 text-red-600 font-medium animate-pulse" role="alert">
                            {fieldErrors.firstName}
                          </p>
                        )}
                      </div>
                      <div className="group">
                        <label 
                          htmlFor="lastName" 
                          className="block text-lg font-bold text-gray-800 mb-3 group-focus-within:text-indigo-600 transition-colors"
                        >
                          Last Name *
                        </label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={form.lastName}
                          onChange={handleChange}
                          className={getInputClassName('lastName')}
                          placeholder="Doe"
                          aria-describedby={fieldErrors.lastName ? "lastName-error" : undefined}
                          aria-invalid={!!fieldErrors.lastName}
                          maxLength={50}
                        />
                        {fieldErrors.lastName && (
                          <p id="lastName-error" className="mt-3 text-red-600 font-medium animate-pulse" role="alert">
                            {fieldErrors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="group">
                      <label 
                        htmlFor="email" 
                        className="block text-lg font-bold text-gray-800 mb-3 group-focus-within:text-indigo-600 transition-colors"
                      >
                        Email Address *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className={getInputClassName('email')}
                        placeholder="john@example.com"
                        aria-describedby={fieldErrors.email ? "email-error" : undefined}
                        aria-invalid={!!fieldErrors.email}
                        maxLength={100}
                      />
                      {fieldErrors.email && (
                        <p id="email-error" className="mt-3 text-red-600 font-medium animate-pulse" role="alert">
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>

                    {/* Subject */}
                    <div className="group">
                      <label 
                        htmlFor="subject" 
                        className="block text-lg font-bold text-gray-800 mb-3 group-focus-within:text-indigo-600 transition-colors"
                      >
                        Subject *
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        value={form.subject}
                        onChange={handleChange}
                        className={getInputClassName('subject')}
                        placeholder="How can we help you?"
                        aria-describedby={fieldErrors.subject ? "subject-error" : undefined}
                        aria-invalid={!!fieldErrors.subject}
                        maxLength={100}
                      />
                      {fieldErrors.subject && (
                        <p id="subject-error" className="mt-3 text-red-600 font-medium animate-pulse" role="alert">
                          {fieldErrors.subject}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div className="group">
                      <label 
                        htmlFor="message" 
                        className="block text-lg font-bold text-gray-800 mb-3 group-focus-within:text-indigo-600 transition-colors"
                      >
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={form.message}
                        onChange={handleChange}
                        className={getInputClassName('message')}
                        placeholder="Tell us more about your inquiry..."
                        aria-describedby={fieldErrors.message ? "message-error" : undefined}
                        aria-invalid={!!fieldErrors.message}
                        maxLength={1000}
                      ></textarea>
                      {fieldErrors.message && (
                        <p id="message-error" className="mt-3 text-red-600 font-medium animate-pulse" role="alert">
                          {fieldErrors.message}
                        </p>
                      )}
                      <div className="mt-2 text-gray-600 text-right font-medium">
                        {form.message.length}/1000 characters
                      </div>
                    </div>

                    {/* Enhanced Submit Button */}
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-indigo-500/50 transform hover:scale-[1.02] transition-all duration-500 flex items-center justify-center space-x-4 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-indigo-500/30 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10 flex items-center space-x-4">
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                            <span>Sending Your Message...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                            <span>Send Message</span>
                            <Sparkles className="h-5 w-5 animate-pulse" />
                          </>
                        )}
                      </div>
                    </button>
                    <div>
                      </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;