import { useEffect, useState, useCallback } from 'react';
import supabase from '../utils/supabase';

// Tipe data kursus
interface Course {
  id: number;
  title: string;
  category: string;
  level: string;
  created_at: string;
}

// Komponen Skeleton Loader
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="bg-white p-5 rounded-xl shadow-md">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="h-8 bg-gray-300 rounded w-full mb-3 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      </div>
    ))}
  </div>
);

const DashboardCourse = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase
      .from('courses')
      .select('id, title, category, level, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      setErrorMsg('Gagal memuat data kursus. Silakan coba lagi nanti.');
      console.error('Error fetching courses:', error.message);
      setCourses([]);
    } else {
      setCourses(data || []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const renderContent = () => {
    if (loading) {
      return <LoadingSkeleton />;
    }

    if (errorMsg) {
      return (
        <div className="text-center p-10 bg-red-50 rounded-lg">
          <p className="text-red-600 mb-4">{errorMsg}</p>
          <button
            onClick={fetchCourses}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      );
    }

    if (courses.length === 0) {
      return (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Belum ada kursus yang ditambahkan.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* --- PERUBAHAN UTAMA: Kode CourseCard digabung di sini --- */}
        {courses.map(course => (
          <div 
            key={course.id}
            className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:scale-105 transform transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="mb-3">
                <span className="text-sm font-semibold text-indigo-600 bg-indigo-100 py-1 px-3 rounded-full">
                  {course.category}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-800" title={course.title}>
                {course.title}
              </h2>
              <p className="text-md text-gray-600 mt-2">Level: {course.level}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Dibuat pada: {new Date(course.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        ))}
        {/* --- AKHIR PERUBAHAN --- */}
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Kursus</h1>
          <p className="text-gray-500 mt-1">Daftar semua kursus yang tersedia di platform.</p>
        </div>
        <button className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
            + Tambah Kursus
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default DashboardCourse;