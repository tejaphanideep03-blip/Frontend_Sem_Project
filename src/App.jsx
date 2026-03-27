import React, { useState } from 'react';
import './App.css';
import LoginModal from './LoginModal';

const AVAILABLE_ACCESSORIES = [
  { name: 'Cloud Backup', price: 50 },
  { name: 'Data Extension', price: 100 },
  { name: 'Priority Support', price: 150 }
];

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState('signin');
  const [activeView, setActiveView] = useState('plans');
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  const [user, setUser] = useState(null);
  const [editingSubscriptionId, setEditingSubscriptionId] = useState(null);
  const [isAnnual, setIsAnnual] = useState(false);

  const openModal = (view) => {
    setModalView(view);
    setIsModalOpen(true);
  };

  const handleSubscribe = (planName, price) => {
    if (!user) {
      alert("Please Sign In or Sign Up to subscribe to a plan!");
      openModal('signin');
      return;
    }
    const newSubscription = {
      id: Date.now(),
      name: planName,
      price: price,
      accessories: [],
      date: new Date().toLocaleDateString(),
      isAnnual: isAnnual
    };
    setActiveSubscriptions([...activeSubscriptions, newSubscription]);
    alert(`Successfully subscribed to ${planName} plan (${isAnnual ? 'Annual' : 'Monthly'})!`);
  };

  const handleAddAccessory = (subId, accessory) => {
    setActiveSubscriptions(activeSubscriptions.map(sub => {
      if (sub.id === subId) {
        if (!sub.accessories.find(a => a.name === accessory.name)) {
          return { ...sub, accessories: [...sub.accessories, accessory] };
        }
      }
      return sub;
    }));
  };

  const handleRemoveAccessory = (subId, accessoryName) => {
    setActiveSubscriptions(activeSubscriptions.map(sub => {
      if (sub.id === subId) {
        return { ...sub, accessories: sub.accessories.filter(a => a.name !== accessoryName) };
      }
      return sub;
    }));
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveView('plans');
  };

  const handleRemoveSubscription = (id) => {
    setActiveSubscriptions(activeSubscriptions.filter(sub => sub.id !== id));
  };

  return (
    <div className="web">
      <header>
        <div className="title">
          <h1>SUBSCRIPTION MANAGMENT</h1>
        </div>
        <nav>
          <ul>
            {user ? (
              <>
                <li className="user-info">Hi, {user.name}</li>
                <li onClick={handleLogout}>Logout</li>
              </>
            ) : (
              <>
                <li onClick={() => openModal('signin')}>Sign In</li>
                <li onClick={() => openModal('signup')}>Sign Up</li>
              </>
            )}
            <li onClick={() => setActiveView('active-plans')} className={activeView === 'active-plans' ? 'active' : ''}>Active Plans</li>
            <li onClick={() => setActiveView('plans')} className={activeView === 'plans' ? 'active' : ''}>Plans</li>
          </ul>
        </nav>
      </header>
      <div className="container">
        {activeView === 'plans' ? (
          <section id="plans">
            <div className="heading">
              <h2>Choose Your Plan</h2>
              <p>Simple and transparent pricing.</p>
            </div>
            <div className="pricing-toggle-container">
              <div className="pricing-toggle">
                <button 
                  className={`toggle-btn ${!isAnnual ? 'active' : ''}`} 
                  onClick={() => setIsAnnual(false)}
                >
                  Monthly
                </button>
                <button 
                  className={`toggle-btn ${isAnnual ? 'active' : ''}`} 
                  onClick={() => setIsAnnual(true)}
                >
                  Annual <span className="save-badge">Save 20%</span>
                </button>
              </div>
            </div>
            <div className="plansName">
              <div className="plan">
                <h3>Basic</h3>
                <ul>
                  <li>online multiplayer</li>
                  <li>two monthly games</li>
                  <li>Email Support</li>
                  <li>Price: ₹{isAnnual ? Math.round(249 * 12 * 0.8) : 249}{isAnnual ? ' /year' : ' /month'}</li>
                </ul>
                <button className="cart" onClick={() => handleSubscribe('Basic', isAnnual ? Math.round(249 * 12 * 0.8) : 249)}>Subscribe</button>
              </div>
              <div className="plan">
                <h3>Standard</h3>
                <ul>
                  <li>Offers a large catalog of PC games</li>
                  <li>four monthly games</li>
                  <li>Priority Email Support</li>
                  <li>Price: ₹{isAnnual ? Math.round(499 * 12 * 0.8) : 499}{isAnnual ? ' /year' : ' /month'}</li>
                </ul>
                <button className="cart" onClick={() => handleSubscribe('Standard', isAnnual ? Math.round(499 * 12 * 0.8) : 499)}>Subscribe</button>
              </div>
              <div className="plan">
                <h3>Premium</h3>
                <ul>
                  <li>Includes everything in Core and Standard/PC</li>
                  <li>eight monthly games</li>
                  <li>24/7 Support</li>
                  <li>Price: ₹{isAnnual ? Math.round(999 * 12 * 0.8) : 999}{isAnnual ? ' /year' : ' /month'}</li>
                </ul>
                <button className="cart" onClick={() => handleSubscribe('Premium', isAnnual ? Math.round(999 * 12 * 0.8) : 999)}>Subscribe</button>
              </div>
            </div>
          </section>
        ) : (
          <section id="active-subscriptions">
            <div className="heading">
              <h2>Your Active Plans</h2>
              <p>Manage your current subscriptions here.</p>
            <div className="active-plans-container">
              {activeSubscriptions.length > 0 ? (
                <div className="checkout-dashboard">
                  {/* Left Side: Plan & Add-ons */}
                  <div className="customization-area">
                    <div className="view-header">
                      <h2>Customize Your Plan</h2>
                      <p>Add features and customize your subscription to match your exact requirements.</p>
                    </div>

                    {(() => {
                      const currentId = editingSubscriptionId || activeSubscriptions[0]?.id;
                      const sub = activeSubscriptions.find(s => s.id === currentId);
                      if (!sub) return null;

                      return (
                        <>
                          <div className="selected-plan-banner">
                            <div className="banner-info">
                              <h3>{sub.name} Plan</h3>
                              <p>For growing teams and businesses</p>
                            </div>
                            <div className="banner-price">
                              <span className="currency">₹</span>
                              <span className="amount">{sub.price}</span>
                              <span className="period">{sub.isAnnual ? '/year' : '/month'}</span>
                            </div>
                          </div>

                          <div className="addons-section">
                            <div className="section-head">
                              <h3>Add-ons & Extras</h3>
                            </div>
                            <div className="addons-list">
                              {AVAILABLE_ACCESSORIES.map(acc => {
                                const isAdded = sub.accessories.some(a => a.name === acc.name);
                                return (
                                  <div className={`addon-row ${isAdded ? 'active' : ''}`} key={acc.name}>
                                    <div className="addon-meta">
                                      <div className="checkbox-wrap">
                                        <input 
                                          type="checkbox" 
                                          checked={isAdded} 
                                          onChange={() => isAdded ? handleRemoveAccessory(sub.id, acc.name) : handleAddAccessory(sub.id, acc)}
                                        />
                                      </div>
                                      <div className="addon-text">
                                        <p className="name">{acc.name}</p>
                                        <p className="desc">Enhanced capacity and features</p>
                                      </div>
                                    </div>
                                    <div className="addon-price">
                                      ₹{acc.price}/mo
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Right Side: Order Summary */}
                  <div className="summary-side">
                    {(() => {
                      const currentId = editingSubscriptionId || activeSubscriptions[0]?.id;
                      const sub = activeSubscriptions.find(s => s.id === currentId);
                      if (!sub) return null;
                      
                      const totalAddons = sub.accessories.reduce((sum, acc) => sum + acc.price, 0);
                      const grandTotal = sub.price + totalAddons;

                      return (
                        <div className="order-summary-card">
                          <h3>Order Summary</h3>
                          <div className="summary-lines">
                            <div className="line">
                              <span>{sub.name} Plan</span>
                              <span>₹{sub.price.toFixed(2)}</span>
                            </div>
                            {sub.accessories.map(acc => (
                              <div className="line addon-line" key={acc.name}>
                                <span>{acc.name}</span>
                                <span>+₹{acc.price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="summary-total">
                            <span className="total-label">Total</span>
                            <div className="total-amount">
                              <span className="amount">₹{grandTotal.toFixed(2)}</span>
                              <span className="period">{sub.isAnnual ? '/year' : '/month'}</span>
                            </div>
                          </div>

                          <button className="activate-btn" onClick={() => alert('Payment Successful!')}>
                            Make Payment
                          </button>
                          <button className="cancel-btn" onClick={() => {
                            if (window.confirm("Are you sure you want to cancel this subscription?")) {
                              handleRemoveSubscription(sub.id);
                              alert("Subscription cancelled successfully.");
                            }
                          }}>
                            Cancel Subscription
                          </button>

                          <div className="plan-switcher">
                            <p>Managing {activeSubscriptions.length} Plans</p>
                            <select 
                              value={currentId} 
                              onChange={(e) => setEditingSubscriptionId(parseInt(e.target.value))}
                            >
                              {activeSubscriptions.map(s => (
                                <option key={s.id} value={s.id}>{s.name} Plan ({s.date})</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="no-subscriptions">
                  <p>You don't have any active subscriptions yet.</p>
                  <button className="browse-btn" onClick={() => setActiveView('plans')}>Browse Plans</button>
                </div>
              )}
            </div>    </div>
          </section>
        )}
      </div>
      <footer>
        <div>
          <h3>Arkadas</h3>
          <p>© 2026 Arkadas. All rights reserved.</p>
        </div>
      </footer>

      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoginSuccess={handleLogin}
        initialView={modalView}
      />
    </div>
  );
}

export default App;
