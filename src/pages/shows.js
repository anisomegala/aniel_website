import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import AnimatedText from '@/components/AnimatedText';
import { motion } from 'framer-motion';

const ShowItem = ({ show }) => {
  const dateObj = new Date(show.date);
  const day = dateObj.toLocaleDateString('en-US', { day: '2-digit' });
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' });

  // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
  const formatGoogleDate = (date) => {
    return new Date(date).toISOString().replace(/-|:|\.\d\d\d/g, "");
  };

  const startTime = formatGoogleDate(show.date);
  // Default end time to 2 hours after start
  const endTime = formatGoogleDate(new Date(new Date(show.date).getTime() + 2 * 60 * 60 * 1000));

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(show.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent("Don't miss the show! Details: " + show.link)}&location=${encodeURIComponent(show.location)}`;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between w-full p-6 mb-4 rounded-2xl border border-dark/10 dark:border-light/10 bg-light/50 dark:bg-dark/50 backdrop-blur-sm"
    >
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center border-r border-primary/30 pr-8 text-primary font-bold">
          <span className="text-sm uppercase">{month}</span>
          <span className="text-2xl">{day}</span>
        </div>
        <div>
          <h3 className="text-xl font-bold dark:text-light">{show.title}</h3>
          <p className="text-dark/60 dark:text-light/60">{show.location}</p>
        </div>
      </div>
      
      {/* ADD TO CALENDAR BUTTON */}
      <a 
        href={googleCalendarUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-dark text-light px-6 py-2 rounded-full font-semibold hover:bg-primary transition-colors dark:bg-light dark:text-dark text-sm"
      >
        + Add to Calendar
      </a>
    </motion.div>
  );
};

export default function Shows() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/getShows')
      .then(res => res.json())
      .then(data => {
        setShows(data);
        setLoading(false);
      });
  }, []);

  return (
    <main className="w-full min-h-screen dark:text-light">
      <Layout>
        <AnimatedText text="Upcoming Performances" className="!text-6xl mb-16" />
        
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="animate-pulse text-center">Syncing with calendar...</div>
          ) : shows.length > 0 ? (
            shows.map(show => <ShowItem key={show.id} show={show} />)
          ) : (
            <p className="text-center opacity-60">No upcoming shows scheduled. Check back soon!</p>
          )}
        </div>
      </Layout>
    </main>
  );
}