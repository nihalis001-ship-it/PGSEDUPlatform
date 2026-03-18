import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Clock, 
  Users, 
  Plane, 
  ChevronRight, 
  ArrowLeft,
  Search,
  TrendingUp,
  User as UserIcon
} from 'lucide-react';
import { Language, translations } from '../i18n';
import { cn } from '../lib/utils';

interface FlightPerformance {
  id: string;
  flightNumber: string;
  route: string;
  avgTime: number; // in seconds
  totalPassengers: number;
  staffData: StaffPerformance[];
}

interface StaffPerformance {
  id: string;
  name: string;
  avgTime: number; // in seconds
  processedCount: number;
}

const MOCK_DATA: FlightPerformance[] = [
  {
    id: '1',
    flightNumber: 'PC1002',
    route: 'SAW-AYT',
    avgTime: 145,
    totalPassengers: 180,
    staffData: [
      { id: 's1', name: 'Ahmet Yılmaz', avgTime: 130, processedCount: 45 },
      { id: 's2', name: 'Mehmet Demir', avgTime: 160, processedCount: 40 },
      { id: 's3', name: 'Ayşe Kaya', avgTime: 140, processedCount: 50 },
      { id: 's4', name: 'Fatma Çelik', avgTime: 155, processedCount: 45 },
    ]
  },
  {
    id: '2',
    flightNumber: 'PC2005',
    route: 'SAW-ADB',
    avgTime: 132,
    totalPassengers: 165,
    staffData: [
      { id: 's1', name: 'Ahmet Yılmaz', avgTime: 125, processedCount: 40 },
      { id: 's5', name: 'Caner Öz', avgTime: 145, processedCount: 45 },
      { id: 's6', name: 'Selin Ak', avgTime: 135, processedCount: 40 },
      { id: 's7', name: 'Bora Tan', avgTime: 128, processedCount: 40 },
    ]
  },
  {
    id: '3',
    flightNumber: 'PC1500',
    route: 'SAW-ESB',
    avgTime: 158,
    totalPassengers: 175,
    staffData: [
      { id: 's2', name: 'Mehmet Demir', avgTime: 165, processedCount: 45 },
      { id: 's8', name: 'Deniz Yurt', avgTime: 150, processedCount: 40 },
      { id: 's9', name: 'Ece Mert', avgTime: 162, processedCount: 45 },
      { id: 's10', name: 'Okan Şen', avgTime: 155, processedCount: 45 },
    ]
  }
];

export const CheckInPerformance = ({ lang }: { lang: Language }) => {
  const t = translations[lang];
  const [selectedFlight, setSelectedFlight] = useState<FlightPerformance | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFlights = MOCK_DATA.filter(f => 
    f.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-zinc-200 rounded-2xl shadow-xl">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-sm font-bold text-orange-600">{formatTime(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {selectedFlight && (
            <button 
              onClick={() => setSelectedFlight(null)}
              className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-500"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-3xl font-serif font-bold text-zinc-900">
              {selectedFlight ? `${selectedFlight.flightNumber} ${selectedFlight.route}` : t.checkInPerformance}
            </h2>
            <p className="text-zinc-500 mt-1">
              {selectedFlight ? t.userBased : t.performanceAnalytics}
            </p>
          </div>
        </div>

        {!selectedFlight && (
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 outline-none"
            />
          </div>
        )}
      </header>

      <AnimatePresence mode="wait">
        {!selectedFlight ? (
          <motion.div
            key="flight-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredFlights.map((flight, idx) => (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedFlight(flight)}
                className="group bg-white p-6 rounded-3xl border border-zinc-200 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/20 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
                    <Plane className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.flightNumber}</span>
                    <p className="text-lg font-bold text-zinc-900">{flight.flightNumber}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs font-medium">{t.avgCheckInTime}</span>
                    </div>
                    <span className="text-sm font-bold text-orange-600">{formatTime(flight.avgTime)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Users className="w-4 h-4" />
                      <span className="text-xs font-medium">Total Pax</span>
                    </div>
                    <span className="text-sm font-bold text-zinc-900">{flight.totalPassengers}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-zinc-50 flex items-center justify-between group-hover:text-orange-600 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-wider">{t.detailedProcedure}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="staff-details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectedFlight.staffData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#71717a', fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#71717a', fontWeight: 600 }}
                      tickFormatter={(val) => `${val}s`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="avgTime" radius={[8, 8, 0, 0]} barSize={40}>
                      {selectedFlight.staffData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.avgTime > 150 ? '#ef4444' : '#f97316'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedFlight.staffData.map((staff, idx) => (
                <motion.div
                  key={staff.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-3xl border border-zinc-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400">
                      <UserIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900">{staff.name}</h4>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                        {staff.processedCount} Passengers
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                      {t.avgTime}
                    </span>
                    <p className={cn(
                      "text-lg font-bold",
                      staff.avgTime > 150 ? "text-red-600" : "text-orange-600"
                    )}>
                      {formatTime(staff.avgTime)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
