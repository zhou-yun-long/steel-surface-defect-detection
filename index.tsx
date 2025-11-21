
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// --- Types ---
interface Paper {
  id: string | number;
  title: string;
  authors: string;
  journal: string;
  year: number;
  isOpenSource: boolean;
  codeUrl?: string;
  pdfUrl?: string;
  metrics?: string;
}

// --- Mock Data ---
const DEFAULT_PAPERS: Paper[] = [
  {
    id: 1,
    title: "NEU-DET: A new dataset for steel surface defect detection",
    authors: "Song, K., Yan, Y.",
    journal: "Neurocomputing",
    year: 2013,
    isOpenSource: true,
    codeUrl: "https://github.com/example/neu-det",
    metrics: "Baseline",
  },
  {
    id: 2,
    title: "Real-time defect detection using YOLOv5 on steel surfaces",
    authors: "Zhang, L., Wang, J.",
    journal: "IEEE TIM",
    year: 2021,
    isOpenSource: true,
    codeUrl: "https://github.com/example/yolo-steel",
    metrics: "mAP: 82.1%",
  },
  {
    id: 3,
    title: "Transformer-based approach for defect classification in manufacturing",
    authors: "Li, H., Chen, X.",
    journal: "IEEE TII",
    year: 2022,
    isOpenSource: false,
    metrics: "Acc: 94.5%",
  },
  {
    id: 4,
    title: "Survey on deep learning for metallic surface defect detection",
    authors: "Luo, Q., Fang, X.",
    journal: "Signal Processing",
    year: 2020,
    isOpenSource: true,
    pdfUrl: "#",
    metrics: "Review",
  },
  {
    id: 5,
    title: "High-resolution defect detection with weakly supervised learning",
    authors: "Wu, D., Liu, Y.",
    journal: "CVPR",
    year: 2023,
    isOpenSource: true,
    codeUrl: "https://github.com/example/ws-steel",
    metrics: "mAP: 85.3%",
  },
  {
    id: 6,
    title: "Automated optical inspection using GANs for sample generation",
    authors: "Smith, J., Doe, A.",
    journal: "IEEE TII",
    year: 2021,
    isOpenSource: false,
    metrics: "FID: 12.4",
  },
  {
    id: 7,
    title: "GC10-DET: A New Dataset for Steel Surface Defect Detection",
    authors: "Lv, X., Duan, F.",
    journal: "Sensors",
    year: 2020,
    isOpenSource: true,
    codeUrl: "#",
    metrics: "mAP: 76.2%",
  },
  {
    id: 8,
    title: "Pyramid Feature Attention Network for Saliency Detection",
    authors: "Wang, T., Zhang, L.",
    journal: "CVPR",
    year: 2019,
    isOpenSource: true,
    codeUrl: "#",
    metrics: "F-measure: 0.88",
  }
];

const DATASETS = [
  {
    id: 1,
    title: "NEU-DET",
    subtitle: "东北大学表面缺陷数据集",
    count: "1,800",
    resolution: "200x200",
    desc: "包含6种常见缺陷（裂纹、夹杂、斑块、点蚀表面、轧制氧化皮、划痕）。是该领域最经典的数据集之一。",
    color: "text-primary",
    bg: "bg-primary/10",
    link: "http://faculty.neu.edu.cn/yunhyan/NEU_surface_defect_database.html"
  },
  {
    id: 2,
    title: "GC10-DET",
    subtitle: "大规模工业金属表面数据集",
    count: "3,570",
    resolution: "2048x1000",
    desc: "包含10种缺陷类型，专注于现实世界工业环境中的复杂干扰，如不均匀照明和反射。",
    color: "text-secondary",
    bg: "bg-secondary/10",
    link: "#"
  },
  {
    id: 3,
    title: "Severstal",
    subtitle: "Kaggle钢铁缺陷检测竞赛",
    count: "12,568",
    resolution: "1600x256",
    desc: "由Severstal Steel提供的高分辨率图像数据集，用于语义分割任务，包含4种缺陷类别。",
    color: "text-accent",
    bg: "bg-accent/10",
    link: "https://www.kaggle.com/c/severstal-steel-defect-detection"
  },
  {
    id: 4,
    title: "KolektorSDD",
    subtitle: "电子换向器表面数据集",
    count: "399",
    resolution: "High-Res",
    desc: "专注于微小表面裂纹和缺陷的检测，适用于高精度工业检测算法研究。",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    link: "#"
  }
];

const COMPETITIONS = [
  {
    id: 1,
    year: "2024",
    title: "Severstal Steel Defect Detection Challenge",
    status: "已结束",
    statusColor: "bg-gray-500",
    desc: "在Kaggle平台上举办的经典比赛，旨在定位和分类钢铁表面的制造缺陷。",
    link: "#"
  },
  {
    id: 2,
    year: "2025",
    title: "GC-Steel Industrial AI Challenge",
    status: "进行中",
    statusColor: "bg-primary",
    desc: "专注于低样本学习和小目标检测的工业级挑战赛，总奖金池 $50,000。",
    link: "#"
  },
  {
    id: 3,
    year: "2025",
    title: "CVPR Industrial Vision Workshop",
    status: "即将开始",
    statusColor: "bg-secondary",
    desc: "CVPR 2025 workshop，征集关于工业视觉异常检测与表面缺陷分析的前沿论文。",
    link: "#"
  }
];

const TEAM_MEMBERS = [
  {
    id: 1,
    name: "李明博士",
    role: "教授 / 实验室主任",
    school: "清华大学",
    desc: "主要研究方向为计算机视觉、工业智能检测。在CVPR, ICCV等顶级会议发表论文50余篇。",
    image: "https://picsum.photos/id/1005/400/400"
  },
  {
    id: 2,
    name: "张伟",
    role: "博士研究生",
    school: "上海交通大学",
    desc: "专注于小样本学习在表面缺陷检测中的应用，提出了多个高效的轻量化检测网络。",
    image: "https://picsum.photos/id/1012/400/400"
  },
  {
    id: 3,
    name: "王芳",
    role: "硕士研究生",
    school: "浙江大学",
    desc: "研究兴趣包括无监督异常检测和生成对抗网络数据增强。",
    image: "https://picsum.photos/id/1027/400/400"
  }
];

const App = () => {
  const [papers, setPapers] = useState<Paper[]>(DEFAULT_PAPERS);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Filter States
  const [filterYear, setFilterYear] = useState<string>('All');
  const [filterJournal, setFilterJournal] = useState<string>('All');
  const [filterOpenSource, setFilterOpenSource] = useState<string>('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset page when filters change, papers update, or itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterYear, filterJournal, filterOpenSource, papers, itemsPerPage]);

  // --- Derived Data ---
  const uniqueYears = useMemo(() => {
    const years = Array.from(new Set(papers.map(p => p.year)));
    return years.sort((a, b) => b - a);
  }, [papers]);

  const uniqueJournals = useMemo(() => {
    const journals = Array.from(new Set(papers.map(p => p.journal)));
    return journals.sort();
  }, [papers]);

  // --- Filtering Logic ---
  const filteredPapers = useMemo(() => {
    return papers.filter(paper => {
      const matchYear = filterYear === 'All' || paper.year === Number(filterYear);
      const matchJournal = filterJournal === 'All' || paper.journal === filterJournal;
      const matchOpenSource = 
        filterOpenSource === 'All' ? true :
        filterOpenSource === 'Yes' ? paper.isOpenSource :
        !paper.isOpenSource;
      
      return matchYear && matchJournal && matchOpenSource;
    });
  }, [papers, filterYear, filterJournal, filterOpenSource]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredPapers.length / itemsPerPage);
  const currentPapers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPapers.slice(start, start + itemsPerPage);
  }, [filteredPapers, currentPage, itemsPerPage]);

  // --- Handlers ---
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          setPapers(json);
          setFilterYear('All');
          setFilterJournal('All');
          setFilterOpenSource('All');
          alert(`成功导入 ${json.length} 篇论文数据！`);
        } else {
          alert('JSON 格式错误：根元素必须是数组。');
        }
      } catch (err) {
        alert('无法解析 JSON 文件。');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Scroll Handling for Navbar
  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const papersSection = document.getElementById('papers');
    if (papersSection) {
      papersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-inter">
      
      {/* 导航栏 */}
      <header className="fixed w-full bg-white/90 backdrop-blur-md shadow-sm z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <a href="#" className="flex items-center space-x-2" onClick={() => scrollToSection('home')}>
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fa fa-layer-group text-white text-xl"></i>
              </div>
              <span className="text-xl font-bold text-dark">钢铁表面缺陷<span className="text-primary">研究</span></span>
            </a>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-1">
              <button onClick={() => scrollToSection('home')} className="nav-link">首页</button>
              <button onClick={() => scrollToSection('papers')} className="nav-link">研究论文</button>
              <button onClick={() => scrollToSection('datasets')} className="nav-link">数据集</button>
              <button onClick={() => scrollToSection('competitions')} className="nav-link">学术竞赛</button>
              <button onClick={() => scrollToSection('team')} className="nav-link">研究团队</button>
            </nav>

            <div className="hidden md:block">
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    <i className="fa fa-globe mr-1"></i> English
                </button>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className={`fa ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
          
          {/* Mobile Nav Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-2 border-t border-gray-100 pt-2">
              <button onClick={() => scrollToSection('home')} className="block w-full text-left py-2 text-gray-700 hover:text-primary">首页</button>
              <button onClick={() => scrollToSection('papers')} className="block w-full text-left py-2 text-gray-700 hover:text-primary">研究论文</button>
              <button onClick={() => scrollToSection('datasets')} className="block w-full text-left py-2 text-gray-700 hover:text-primary">数据集</button>
              <button onClick={() => scrollToSection('competitions')} className="block w-full text-left py-2 text-gray-700 hover:text-primary">学术竞赛</button>
              <button onClick={() => scrollToSection('team')} className="block w-full text-left py-2 text-gray-700 hover:text-primary">研究团队</button>
              <button className="block w-full text-left py-2 text-primary font-medium mt-2">
                 <i className="fa fa-globe mr-1"></i> English
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 英雄区域 */}
      <section id="home" className="pt-28 pb-20 md:pt-36 md:pb-28 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-bold text-dark leading-tight mb-6">
                钢铁表面缺陷<br/><span className="text-primary">学术研究平台</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                汇聚前沿的工业视觉检测技术，集成CVPR、ICCV等顶会论文与NEU-DET等核心数据集，推动智能制造技术发展。
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => scrollToSection('papers')} className="btn-primary">
                  浏览最新论文 <i className="fa fa-arrow-right ml-2"></i>
                </button>
                <button onClick={() => scrollToSection('datasets')} className="btn-secondary">
                  获取数据集 <i className="fa fa-database ml-2"></i>
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/10 rounded-full"></div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary/10 rounded-full"></div>
                <img src="https://picsum.photos/id/180/800/600" alt="" className="w-full h-auto rounded-2xl shadow-xl relative z-10 object-cover border-4 border-white" style={{maxHeight: '400px'}} />
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-lg z-20 w-3/4">
                  <div className="flex justify-around items-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{papers.length}+</div>
                      <div className="text-sm text-gray-500">收录论文</div>
                    </div>
                    <div className="w-px h-10 bg-gray-200"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">{DATASETS.length}</div>
                      <div className="text-sm text-gray-500">数据集</div>
                    </div>
                    <div className="w-px h-10 bg-gray-200"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">{COMPETITIONS.length}</div>
                      <div className="text-sm text-gray-500">学术竞赛</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 研究论文 */}
      <section id="papers" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8">
             <div>
                <h2 className="section-title">研究论文</h2>
                <p className="text-lg text-gray-600 mt-2 mb-4 max-w-3xl">
                  浏览钢铁表面缺陷检测领域的经典研究论文，涵盖最新的CVPR、ICCV等顶级会议发表的重要成果。
                </p>
             </div>
             <div className="flex gap-3">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept=".json" 
                    className="hidden" 
                />
                <button 
                    onClick={handleImportClick}
                    className="bg-white text-primary border border-primary hover:bg-primary hover:text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                   <i className="fa fa-upload mr-1"></i> 导入数据
                </button>
             </div>
          </div>
          
          {/* 论文筛选器 - 3 Dropdowns */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-10 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Is Open Source */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  <i className="fa fa-code mr-1 text-primary"></i> 是否开源
                </label>
                <select 
                  value={filterOpenSource}
                  onChange={(e) => setFilterOpenSource(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  <option value="All">全部</option>
                  <option value="Yes">已开源</option>
                  <option value="No">未开源</option>
                </select>
              </div>

              {/* 2. Journal */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                   <i className="fa fa-book mr-1 text-secondary"></i> 期刊 / 会议
                </label>
                <select 
                  value={filterJournal}
                  onChange={(e) => setFilterJournal(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  <option value="All">全部期刊</option>
                  {uniqueJournals.map(j => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
              </div>

              {/* 3. Year */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                   <i className="fa fa-calendar mr-1 text-accent"></i> 年份
                </label>
                <select 
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  <option value="All">全部年份</option>
                  {uniqueYears.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* 论文列表 Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                        <tr>
                            <th className="p-5">#</th>
                            <th className="p-5">论文标题</th>
                            <th className="p-5">作者</th>
                            <th className="p-5 text-center">期刊</th>
                            <th className="p-5 text-center">年份</th>
                            <th className="p-5 text-center">开源</th>
                            <th className="p-5 text-right">链接</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {currentPapers.length > 0 ? currentPapers.map((paper, idx) => (
                            <tr key={paper.id} className="hover:bg-blue-50/50 transition-colors group">
                                <td className="p-5 text-gray-400 text-sm">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                <td className="p-5">
                                    <div className="font-bold text-gray-800 group-hover:text-primary transition-colors">{paper.title}</div>
                                    {paper.metrics && (
                                        <span className="inline-block mt-1 text-xs text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded">
                                            {paper.metrics}
                                        </span>
                                    )}
                                </td>
                                <td className="p-5 text-gray-600 text-sm">{paper.authors}</td>
                                <td className="p-5 text-center">
                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border border-gray-200">
                                        {paper.journal}
                                    </span>
                                </td>
                                <td className="p-5 text-center text-gray-600">{paper.year}</td>
                                <td className="p-5 text-center">
                                    {paper.isOpenSource ? (
                                        <i className="fa fa-check-circle text-secondary text-lg"></i>
                                    ) : (
                                        <i className="fa fa-times-circle text-gray-300 text-lg"></i>
                                    )}
                                </td>
                                <td className="p-5 text-right">
                                    <div className="flex justify-end space-x-3">
                                        {paper.codeUrl && (
                                            <a href={paper.codeUrl} target="_blank" className="text-gray-400 hover:text-dark transition-colors" title="Code">
                                                <i className="fa-brands fa-github text-xl"></i>
                                            </a>
                                        )}
                                        {paper.pdfUrl && (
                                            <a href={paper.pdfUrl} target="_blank" className="text-gray-400 hover:text-red-500 transition-colors" title="PDF">
                                                <i className="fa fa-file-pdf text-xl"></i>
                                            </a>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={7} className="p-10 text-center text-gray-500">
                                    未找到匹配的论文。
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>
          
          {/* Pagination Controls */}
          {filteredPapers.length > 0 && (
            <div className="mt-8">
                <div className="flex justify-center items-center space-x-2">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                        <i className="fa fa-chevron-left mr-1"></i> 上一页
                    </button>
                    
                    <div className="flex space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                    currentPage === pageNum 
                                        ? 'bg-primary text-white shadow-md' 
                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {pageNum}
                            </button>
                        ))}
                    </div>
                    
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                        下一页 <i className="fa fa-chevron-right ml-1"></i>
                    </button>
                </div>

                <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4 text-gray-500 text-sm">
                    <span>
                        显示第 {currentPage} 页，共 {totalPages} 页 (总计 {filteredPapers.length} 篇)
                    </span>
                    
                    <div className="flex items-center space-x-2">
                        <span>每页显示</span>
                        <select 
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="bg-white border border-gray-300 text-gray-700 py-1 px-2 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                        >
                            <option value={5}>5 条</option>
                            <option value={10}>10 条</option>
                            <option value={20}>20 条</option>
                            <option value={50}>50 条</option>
                        </select>
                    </div>
                </div>
            </div>
          )}
          
        </div>
      </section>

      {/* 相关数据集 */}
      <section id="datasets" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title">数据集</h2>
          <p className="text-lg text-gray-600 mt-6 mb-12 max-w-3xl">
            探索用于钢铁表面缺陷检测的公开数据集，这些数据集涵盖了不同工艺和缺陷类型。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {DATASETS.map(dataset => (
              <div key={dataset.id} className="bg-white rounded-xl shadow-md overflow-hidden card-hover border border-gray-100">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 mb-6 md:mb-0">
                      <div className={`${dataset.bg} rounded-lg p-4 text-center h-full flex flex-col justify-center`}>
                        <div className={`text-2xl font-bold ${dataset.color} mb-2`}>{dataset.count}</div>
                        <div className="text-sm font-medium text-dark mb-1 truncate" title={dataset.title}>{dataset.title}</div>
                        <div className="text-xs text-gray-600">Samples</div>
                      </div>
                    </div>
                    <div className="md:w-3/4 md:pl-8">
                      <h3 className="text-xl font-bold text-dark mb-3">{dataset.title} - {dataset.subtitle}</h3>
                      <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                        {dataset.desc}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            <i className="fa fa-image mr-1"></i> {dataset.resolution}
                        </div>
                        <a href={dataset.link} target="_blank" className="btn-primary text-sm px-4 py-1.5">
                          访问数据集 <i className="fa fa-arrow-right ml-2"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 学术竞赛 */}
      <section id="competitions" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title">学术竞赛</h2>
          <p className="text-lg text-gray-600 mt-6 mb-12 max-w-3xl">
             参与全球范围内的缺陷检测算法挑战赛，与顶尖团队同台竞技。
          </p>
          
          <div className="space-y-8">
             {COMPETITIONS.map(comp => (
                 <div key={comp.id} className="bg-white rounded-xl shadow-md overflow-hidden card-hover">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/5 mb-4 md:mb-0 flex items-center justify-center md:justify-start">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-gray-200">{comp.year}</div>
                                    <span className={`inline-block mt-2 text-xs text-white px-2 py-1 rounded ${comp.statusColor}`}>
                                        {comp.status}
                                    </span>
                                </div>
                            </div>
                            <div className="md:w-3/5 md:px-6">
                                <h3 className="text-xl font-bold text-dark mb-2">{comp.title}</h3>
                                <p className="text-gray-600">{comp.desc}</p>
                            </div>
                            <div className="md:w-1/5 flex items-center justify-center md:justify-end mt-4 md:mt-0">
                                <a href={comp.link} className="text-primary hover:text-dark font-medium transition-colors">
                                    了解更多 <i className="fa fa-chevron-right ml-1"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                 </div>
             ))}
          </div>
        </div>
      </section>

      {/* 研究团队 */}
      <section id="team" className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <h2 className="section-title">研究团队</h2>
            <p className="text-lg text-gray-600 mt-6 mb-12 max-w-3xl">
                我们的团队由来自知名高校的专家与研究生组成，致力于解决工业视觉领域的关键难题。
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {TEAM_MEMBERS.map(member => (
                    <div key={member.id} className="bg-white rounded-xl shadow-md overflow-hidden card-hover border border-gray-100">
                        <div className="relative h-64">
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent flex items-end">
                                <div className="p-6 text-white">
                                    <h3 className="text-xl font-bold">{member.name}</h3>
                                    <p className="text-white/80 text-sm">{member.role}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center mb-4 text-sm text-gray-500">
                                <i className="fa fa-university mr-2"></i>
                                <span>{member.school}</span>
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-3">
                                {member.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-12">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <div className="flex items-center space-x-2 mb-6">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            <i className="fa fa-layer-group text-primary text-xl"></i>
                        </div>
                        <span className="text-xl font-bold">钢铁表面缺陷<span className="text-primary">研究</span></span>
                    </div>
                    <p className="text-gray-400 mb-6 max-w-sm">
                        致力于建立最全面、最专业的钢铁表面缺陷检测学术资源平台。
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><i className="fa-brands fa-twitter text-xl"></i></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><i className="fa-brands fa-github text-xl"></i></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><i className="fa fa-envelope text-xl"></i></a>
                    </div>
                </div>
                
                <div className="md:text-right">
                    <h4 className="text-lg font-bold mb-6">快速链接</h4>
                    <ul className="space-y-3">
                        <li><button onClick={() => scrollToSection('home')} className="text-gray-400 hover:text-white transition-colors">首页</button></li>
                        <li><button onClick={() => scrollToSection('papers')} className="text-gray-400 hover:text-white transition-colors">研究论文</button></li>
                        <li><button onClick={() => scrollToSection('datasets')} className="text-gray-400 hover:text-white transition-colors">相关数据集</button></li>
                    </ul>
                </div>
            </div>
            
            <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} 钢铁表面缺陷学术研究平台. 保留所有权利.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
