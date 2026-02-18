import React, { useState } from 'react';
import { useCrm } from '../../hooks/useCrm';
import { PRIORITY_MAP } from '../../constants';

const TaskCalendar: React.FC = () => {
  const { tasks } = useCrm();
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const tasksByDate: { [key: string]: typeof tasks } = {};
  tasks.forEach(task => {
    const dateKey = task.due_date; // YYYY-MM-DD
    if (!tasksByDate[dateKey]) {
      tasksByDate[dateKey] = [];
    }
    tasksByDate[dateKey].push(task);
  });

  const renderCalendar = () => {
    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const calendarDays = [...blanks, ...days];

    return calendarDays.map((day, index) => {
      if (!day) {
        return <div key={`blank-${index}`} className="border border-gray-200"></div>;
      }
      const dayStr = day.toString().padStart(2, '0');
      const monthStr = (month + 1).toString().padStart(2, '0');
      const dateKey = `${year}-${monthStr}-${dayStr}`;
      const dayTasks = tasksByDate[dateKey] || [];
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

      return (
        <div key={day} className="border border-gray-200 p-2 flex flex-col min-h-[120px]">
          <div className={`font-semibold text-sm ${isToday ? 'bg-primary-600 text-white rounded-full w-7 h-7 flex items-center justify-center' : ''}`}>
            {day}
          </div>
          <div className="mt-1 space-y-1 overflow-y-auto">
            {dayTasks.map(task => (
              <div key={task.id} className={`p-1 rounded text-xs ${PRIORITY_MAP[task.priority].color}`}>
                <p className="font-semibold truncate">{task.title}</p>
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)}>&larr;</button>
        <h2 className="text-xl font-bold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => changeMonth(1)}>&rarr;</button>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center font-medium py-2 bg-gray-50 text-sm">{day}</div>
        ))}
        {renderCalendar()}
      </div>
    </div>
  );
};

export default TaskCalendar;
