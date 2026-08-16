import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  updateProfileApi, createProjectApi, updateProjectApi, deleteProjectApi,
  createExperienceApi, updateExperienceApi, deleteExperienceApi,
  createSkillApi, updateSkillApi, deleteSkillApi, createPublicationApi,
  updatePublicationApi, deletePublicationApi, updateContactApi, 
  uploadMediaApi, fetchMediaApi, deleteMediaApi 
} from '../services/api';
import { 
  User, LayoutGrid, Briefcase, Cpu, PhoneCall, Upload, Plus, Trash2, Edit3, 
  Save, LogOut, CheckCircle, ExternalLink, Shield, Image, Copy, HardDrive, Check,
  Eye, Sliders, Search, X, Sparkles, Layers, ArrowUpRight, Folder, FolderPlus, FileText, BookOpen
} from 'lucide-react';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data, refreshData } = usePortfolio();
  const [activeTab, setActiveTab] = useState('overview');
  const [statusMsg, setStatusMsg] = useState('');
  const [copiedUrl, setCopiedUrl] = useState('');

  // Media Library & Foldering State
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [uploadTargetFolder, setUploadTargetFolder] = useState('projects');
  const [customFolders, setCustomFolders] = useState(['projects', 'profile', 'office', 'documents', 'images']);
  const [newFolderName, setNewFolderName] = useState('');
  const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState(data.profile || {});
  const [contactForm, setContactForm] = useState(data.contact || {});
  
  // Project editing modal & search
  const [projectSearch, setProjectSearch] = useState('');
  const [projectFilterType, setProjectFilterType] = useState('all');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '', type: 'website', image: '', description: '', technologies: 'React, Tailwind', github: '', live: '', figma: ''
  });

  // Experience modal
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [expForm, setExpForm] = useState({ company: '', role: '', duration: '', desc: '' });

  // Skill modal
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillForm, setSkillForm] = useState({ name: '', category: 'Frontend Framework', icon: 'Code2', bg: 'bg-foreground/10', color: 'text-foreground' });

  // Publication modal
  const [isPubModalOpen, setIsPubModalOpen] = useState(false);
  const [editingPub, setEditingPub] = useState(null);
  const [pubForm, setPubForm] = useState({
    title: '', publisher: 'IEEE International Conference', year: '2025', authors: 'Humayra Arzooman, et al.', abstract: '', doi: '', pdfUrl: '', link: '', tags: 'UI/UX Design, Cloud Telemetry'
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (data.profile) setProfileForm(data.profile);
    if (data.contact) setContactForm(data.contact);
  }, [data]);

  const loadMediaLibrary = async () => {
    try {
      setMediaLoading(true);
      const files = await fetchMediaApi();
      setMediaFiles(files || []);

      if (files && files.length > 0) {
        const extracted = new Set(['projects', 'profile', 'office', 'documents', 'images']);
        files.forEach(f => {
          if (f.folder && f.folder !== 'root') extracted.add(f.folder);
        });
        setCustomFolders(Array.from(extracted));
      }
    } catch (err) {
      console.error('Failed to load media library:', err);
    } finally {
      setMediaLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'media') {
      loadMediaLibrary();
    }
  }, [activeTab]);

  const showNotification = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    showNotification('Image URL copied to clipboard!');
    setTimeout(() => setCopiedUrl(''), 2500);
  };

  const handleCreateNewFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const clean = newFolderName.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (clean && !customFolders.includes(clean)) {
      setCustomFolders([...customFolders, clean]);
      setUploadTargetFolder(clean);
      setSelectedFolder(clean);
      showNotification(`Folder '${clean}' created!`);
    }
    setNewFolderName('');
    setIsAddFolderModalOpen(false);
  };

  // Image Upload Handler with Folder support
  const handleFileUpload = async (e, callback, targetFolderOverride) => {
    const file = e.target.files[0];
    if (!file) return;
    const folderToUse = targetFolderOverride || uploadTargetFolder || 'images';
    try {
      showNotification(`Uploading asset to MinIO [${folderToUse}/]...`);
      const res = await uploadMediaApi(file, folderToUse);
      const uploadedUrl = res.url || res;
      if (uploadedUrl) {
        if (callback) callback(uploadedUrl);
        showNotification(`File uploaded to '${folderToUse}/' in MinIO!`);
        if (activeTab === 'media') loadMediaLibrary();
      }
    } catch (err) {
      showNotification('MinIO upload error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteMedia = async (key) => {
    if (!window.confirm('Permanently delete this file from MinIO storage?')) return;
    try {
      await deleteMediaApi(key);
      showNotification('File deleted from MinIO.');
      loadMediaLibrary();
    } catch (err) {
      showNotification('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // Save Profile & Section Visibility
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfileApi(profileForm);
      await refreshData();
      showNotification('Profile & Section settings saved successfully!');
    } catch (err) {
      showNotification('Save failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // Save Contact Details
  const handleSaveContact = async (e) => {
    e.preventDefault();
    try {
      await updateContactApi(contactForm);
      await refreshData();
      showNotification('Contact information updated successfully!');
    } catch (err) {
      showNotification('Save failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // Save Project
  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...projectForm,
        technologies: typeof projectForm.technologies === 'string' 
          ? projectForm.technologies.split(',').map(t => t.trim()) 
          : projectForm.technologies
      };
      if (editingProject) {
        await updateProjectApi(editingProject.id, payload);
        showNotification('Project updated successfully!');
      } else {
        await createProjectApi(payload);
        showNotification('New project added successfully!');
      }
      setIsProjectModalOpen(false);
      setEditingProject(null);
      setProjectForm({ title: '', type: 'website', image: '', description: '', technologies: 'React, Tailwind', github: '', live: '', figma: '' });
      await refreshData();
    } catch (err) {
      showNotification('Project save failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProjectApi(id);
      await refreshData();
      showNotification('Project removed.');
    } catch (err) {
      showNotification('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const openProjectModal = (proj = null) => {
    if (proj) {
      setEditingProject(proj);
      setProjectForm({
        title: proj.title || '',
        type: proj.type || 'website',
        image: proj.image || '',
        description: proj.description || '',
        technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies || '',
        github: proj.github || '',
        live: proj.live || '',
        figma: proj.figma || ''
      });
    } else {
      setEditingProject(null);
      setProjectForm({ title: '', type: 'website', image: '', description: '', technologies: 'React, Tailwind', github: '', live: '', figma: '' });
    }
    setIsProjectModalOpen(true);
  };

  // Save Experience
  const handleSaveExperience = async (e) => {
    e.preventDefault();
    try {
      if (editingExp) {
        await updateExperienceApi(editingExp.id, expForm);
        showNotification('Experience updated!');
      } else {
        await createExperienceApi(expForm);
        showNotification('New experience added!');
      }
      setIsExpModalOpen(false);
      setEditingExp(null);
      setExpForm({ company: '', role: '', duration: '', desc: '' });
      await refreshData();
    } catch (err) {
      showNotification('Experience save failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteExperience = async (id) => {
    if (!window.confirm('Delete this experience entry?')) return;
    try {
      await deleteExperienceApi(id);
      await refreshData();
      showNotification('Experience deleted.');
    } catch (err) {
      showNotification('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const openExpModal = (exp = null) => {
    if (exp) {
      setEditingExp(exp);
      setExpForm({ company: exp.company || '', role: exp.role || '', duration: exp.duration || '', desc: exp.desc || '' });
    } else {
      setEditingExp(null);
      setExpForm({ company: '', role: '', duration: '', desc: '' });
    }
    setIsExpModalOpen(true);
  };

  // Save Skill
  const handleSaveSkill = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await updateSkillApi(editingSkill.id, skillForm);
        showNotification('Skill updated!');
      } else {
        await createSkillApi(skillForm);
        showNotification('New skill added!');
      }
      setIsSkillModalOpen(false);
      setEditingSkill(null);
      setSkillForm({ name: '', category: 'Frontend Framework', icon: 'Code2', bg: 'bg-foreground/10', color: 'text-foreground' });
      await refreshData();
    } catch (err) {
      showNotification('Skill save failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await deleteSkillApi(id);
      await refreshData();
      showNotification('Skill removed.');
    } catch (err) {
      showNotification('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const openSkillModal = (skill = null) => {
    if (skill) {
      setEditingSkill(skill);
      setSkillForm({ name: skill.name || '', category: skill.category || '', icon: skill.icon || 'Code2', bg: skill.bg || 'bg-foreground/10', color: skill.color || 'text-foreground' });
    } else {
      setEditingSkill(null);
      setSkillForm({ name: '', category: 'Frontend Framework', icon: 'Code2', bg: 'bg-foreground/10', color: 'text-foreground' });
    }
    setIsSkillModalOpen(true);
  };

  // Save Publication
  const handleSavePublication = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...pubForm,
        tags: typeof pubForm.tags === 'string'
          ? pubForm.tags.split(',').map(t => t.trim())
          : pubForm.tags
      };
      if (editingPub) {
        await updatePublicationApi(editingPub.id, payload);
        showNotification('Publication updated!');
      } else {
        await createPublicationApi(payload);
        showNotification('Publication research paper added!');
      }
      setIsPubModalOpen(false);
      setEditingPub(null);
      setPubForm({ title: '', publisher: 'IEEE International Conference', year: '2025', authors: 'Humayra Arzooman, et al.', abstract: '', doi: '', pdfUrl: '', link: '', tags: 'UI/UX Design, Cloud Telemetry' });
      await refreshData();
    } catch (err) {
      showNotification('Publication save failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeletePublication = async (id) => {
    if (!window.confirm('Delete this publication entry?')) return;
    try {
      await deletePublicationApi(id);
      await refreshData();
      showNotification('Publication removed.');
    } catch (err) {
      showNotification('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const openPubModal = (pub = null) => {
    if (pub) {
      setEditingPub(pub);
      setPubForm({
        title: pub.title || '',
        publisher: pub.publisher || '',
        year: pub.year || '2025',
        authors: pub.authors || '',
        abstract: pub.abstract || '',
        doi: pub.doi || '',
        pdfUrl: pub.pdfUrl || '',
        link: pub.link || '',
        tags: Array.isArray(pub.tags) ? pub.tags.join(', ') : pub.tags || ''
      });
    } else {
      setEditingPub(null);
      setPubForm({ title: '', publisher: 'IEEE International Conference', year: '2025', authors: 'Humayra Arzooman, et al.', abstract: '', doi: '', pdfUrl: '', link: '', tags: 'UI/UX Design, Cloud Telemetry' });
    }
    setIsPubModalOpen(true);
  };

  // Navigation Items
  const navItems = [
    { id: 'overview', label: 'Overview & Controls', icon: Sliders, badge: 'Main' },
    { id: 'profile', label: 'Profile & Hero', icon: User },
    { id: 'projects', label: 'Projects Portfolio', icon: LayoutGrid, count: data.projects?.length || 0 },
    { id: 'experience', label: 'Work Experience', icon: Briefcase, count: data.experiences?.length || 0 },
    { id: 'skills', label: 'Skills & Stack', icon: Cpu, count: data.skills?.length || 0 },
    { id: 'publications', label: 'Publications & Research', icon: BookOpen, count: data.publications?.length || 0 },
    { id: 'contact', label: 'Contact & Socials', icon: PhoneCall },
    { id: 'media', label: 'Media Repository', icon: Image, badge: 'Folders' },
  ];

  // Filtered projects
  const filteredProjects = (data.projects || []).filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(projectSearch.toLowerCase()) || 
                          p.description?.toLowerCase().includes(projectSearch.toLowerCase());
    const matchesType = projectFilterType === 'all' || p.type === projectFilterType;
    return matchesSearch && matchesType;
  });

  // Filtered media files by selected folder
  const filteredMediaFiles = mediaFiles.filter(f => {
    if (selectedFolder === 'all') return true;
    return f.folder === selectedFolder || (selectedFolder === 'root' && (!f.folder || f.folder === 'root'));
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-72 bg-card border-r border-border p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3.5 mb-8 pb-6 border-b border-border">
            <div className="w-11 h-11 rounded-2xl bg-foreground text-background flex items-center justify-center font-extrabold text-lg shadow-md">
              H
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight text-foreground">CMS Studio</h2>
              <span className="text-xs text-muted-foreground">Humayra Arzooman Admin</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-foreground text-background font-bold shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isActive ? 'bg-background/20 text-background' : 'bg-muted border border-border text-foreground/70'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && !item.badge && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-background/20 text-background' : 'bg-muted text-muted-foreground'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-border space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-xs font-semibold text-foreground/80 hover:text-foreground bg-muted/50 hover:bg-muted p-3 rounded-xl border border-border transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink size={15} />
              <span>Live Website</span>
            </div>
            <ArrowUpRight size={14} className="text-muted-foreground" />
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE AREA */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-6xl mx-auto">
        
        {/* Status Toast Alert */}
        {statusMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle size={17} />
              <span>{statusMsg}</span>
            </div>
            <button onClick={() => setStatusMsg('')} className="text-emerald-600 dark:text-emerald-400 hover:opacity-75">
              <X size={15} />
            </button>
          </div>
        )}

        {/* TAB 1: OVERVIEW & SECTION VISIBILITY CONTROLS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">Dashboard Overview & Controls</h1>
              <p className="text-xs text-muted-foreground mt-1">Manage live portfolio status, section visibility toggles, and system metrics.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Projects</span>
                  <h3 className="text-2xl font-black text-foreground mt-1">{data.projects?.length || 0}</h3>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <LayoutGrid size={22} />
                </div>
              </div>

              <div className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Experience Items</span>
                  <h3 className="text-2xl font-black text-foreground mt-1">{data.experiences?.length || 0}</h3>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <Briefcase size={22} />
                </div>
              </div>

              <div className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Publications</span>
                  <h3 className="text-2xl font-black text-foreground mt-1">{data.publications?.length || 0}</h3>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <BookOpen size={22} />
                </div>
              </div>

              <div className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">MinIO Storage</span>
                  <h3 className="text-2xl font-black text-foreground mt-1">Active</h3>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <HardDrive size={22} />
                </div>
              </div>
            </div>

            {/* Section Visibility Controls Form */}
            <form onSubmit={handleSaveProfile} className="bg-card border border-border p-8 rounded-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Eye size={18} className="text-emerald-500" />
                    <span>Section Visibility Toggles</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Control which sections appear on the live website in real time.</p>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Save size={14} />
                  <span>Save Visibility Settings</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {[
                  { key: 'showHero', label: 'Hero / About Section', desc: 'Main banner, display name, and intro statement' },
                  { key: 'showProjects', label: 'Projects Gallery', desc: 'Showcase grid of websites and UI/UX work' },
                  { key: 'showExperience', label: 'Work Experience', desc: 'Career timeline & leadership history' },
                  { key: 'showSkills', label: 'Skills & Stack Matrix', desc: 'Categorized technical capabilities & tools' },
                  { key: 'showGithub', label: 'GitHub Activity', desc: 'Live contribution heatmap & commit counters' },
                  { key: 'showPublications', label: 'Publications & Research', desc: 'Academic research papers, journals & DOI links' },
                  { key: 'showContact', label: 'Contact & Footer', desc: 'Office image, inquiry form & social links' },
                ].map((sec) => (
                  <label 
                    key={sec.key} 
                    className={`flex items-start gap-3.5 p-4 rounded-2xl cursor-pointer border transition-all ${
                      profileForm[sec.key] !== false 
                        ? 'bg-foreground/5 border-foreground/30 shadow-xs' 
                        : 'bg-muted/40 border-border opacity-75'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={profileForm[sec.key] !== false}
                      onChange={e => setProfileForm({ ...profileForm, [sec.key]: e.target.checked })}
                      className="mt-1 w-4 h-4 rounded border-border text-foreground accent-foreground cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-foreground block">{sec.label}</span>
                      <span className="text-[11px] text-muted-foreground block mt-0.5 leading-snug">{sec.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: PROFILE & HERO */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">Profile & Personal Identity</h1>
              <p className="text-xs text-muted-foreground mt-1">Manage display name, professional titles, location, and intro statement.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="bg-card border border-border p-8 rounded-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-foreground/90 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={profileForm.name || ''}
                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm font-medium focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/90 mb-2">Job Title / Subtitle</label>
                  <input
                    type="text"
                    value={profileForm.title || ''}
                    onChange={e => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm font-medium focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/90 mb-2">Location</label>
                  <input
                    type="text"
                    value={profileForm.location || ''}
                    onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm font-medium focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/90 mb-2">Resume / CV Download Link</label>
                  <input
                    type="text"
                    value={profileForm.resumeUrl || ''}
                    onChange={e => setProfileForm({ ...profileForm, resumeUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm font-medium focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/90 mb-2">Hero Intro Statement</label>
                <textarea
                  rows={4}
                  value={profileForm.statement || ''}
                  onChange={e => setProfileForm({ ...profileForm, statement: e.target.value })}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm leading-relaxed font-medium focus:outline-none focus:border-foreground transition-colors"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileForm.availableForWork ?? true}
                    onChange={e => setProfileForm({ ...profileForm, availableForWork: e.target.checked })}
                    className="w-4 h-4 rounded border-border accent-foreground cursor-pointer"
                  />
                  <span className="text-xs font-bold">Show "Available for Work" Badge</span>
                </label>

                <button
                  type="submit"
                  className="px-6 py-3 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save size={15} />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: PROJECTS PORTFOLIO */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-foreground">Projects Portfolio</h1>
                <p className="text-xs text-muted-foreground mt-1">Manage and organize your portfolio showcase items.</p>
              </div>
              <button
                onClick={() => openProjectModal()}
                className="px-5 py-3 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus size={16} />
                <span>Add New Project</span>
              </button>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border p-4 rounded-2xl">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={projectSearch}
                  onChange={e => setProjectSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setProjectFilterType('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    projectFilterType === 'all' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  All ({data.projects?.length || 0})
                </button>
                <button
                  onClick={() => setProjectFilterType('website')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    projectFilterType === 'website' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  Websites
                </button>
                <button
                  onClick={() => setProjectFilterType('ui/ux')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    projectFilterType === 'ui/ux' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  UI/UX
                </button>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((proj) => (
                <div key={proj.id} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-foreground/40 transition-colors">
                  <div>
                    <div className="relative h-48 bg-muted overflow-hidden">
                      <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <span className="px-3 py-1 bg-background/90 backdrop-blur-md rounded-full text-[10px] font-extrabold uppercase tracking-wider text-foreground">
                          {proj.type}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-foreground">{proj.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{proj.description}</p>
                      
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {(proj.technologies || []).map((tech, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-muted border border-border rounded-md text-[10px] font-semibold text-foreground/80">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/30">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold">
                      {proj.live && <a href={proj.live} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Live demo ↗</a>}
                      {proj.github && <a href={proj.github} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">GitHub ↗</a>}
                      {proj.figma && <a href={proj.figma} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Figma ↗</a>}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openProjectModal(proj)}
                        className="p-2 text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Project Modal */}
            {isProjectModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-card border border-border w-full max-w-2xl rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <h3 className="text-lg font-bold text-foreground">
                      {editingProject ? 'Edit Project Details' : 'Add New Project'}
                    </h3>
                    <button onClick={() => setIsProjectModalOpen(false)} className="p-2 text-muted-foreground hover:text-foreground">
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProject} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-foreground/80 mb-1.5">Project Title</label>
                        <input
                          type="text"
                          required
                          value={projectForm.title}
                          onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                          className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-foreground/80 mb-1.5">Project Category</label>
                        <select
                          value={projectForm.type}
                          onChange={e => setProjectForm({ ...projectForm, type: e.target.value })}
                          className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                        >
                          <option value="website">Website / Full Stack</option>
                          <option value="ui/ux">UI/UX Design</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/80 mb-1.5">Cover Image URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={projectForm.image}
                          onChange={e => setProjectForm({ ...projectForm, image: e.target.value })}
                          className="flex-1 px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                          placeholder="MinIO image URL or /assets/..."
                        />
                        <label className="px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-bold hover:bg-muted/80 cursor-pointer flex items-center gap-1.5">
                          <Upload size={14} />
                          <span>Upload (projects/)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => handleFileUpload(e, url => setProjectForm({ ...projectForm, image: url }), 'projects')}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/80 mb-1.5">Description</label>
                      <textarea
                        rows={3}
                        required
                        value={projectForm.description}
                        onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/80 mb-1.5">Technologies (comma separated)</label>
                      <input
                        type="text"
                        value={projectForm.technologies}
                        onChange={e => setProjectForm({ ...projectForm, technologies: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-foreground/80 mb-1.5">Live URL</label>
                        <input
                          type="text"
                          value={projectForm.live}
                          onChange={e => setProjectForm({ ...projectForm, live: e.target.value })}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/80 mb-1.5">GitHub Repository</label>
                        <input
                          type="text"
                          value={projectForm.github}
                          onChange={e => setProjectForm({ ...projectForm, github: e.target.value })}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/80 mb-1.5">Figma File</label>
                        <input
                          type="text"
                          value={projectForm.figma}
                          onChange={e => setProjectForm({ ...projectForm, figma: e.target.value })}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                      <button
                        type="button"
                        onClick={() => setIsProjectModalOpen(false)}
                        className="px-5 py-2.5 bg-muted rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 cursor-pointer"
                      >
                        Save Project
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: WORK EXPERIENCE */}
        {activeTab === 'experience' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-foreground">Work Experience</h1>
                <p className="text-xs text-muted-foreground mt-1">Manage career timeline and leadership history.</p>
              </div>
              <button
                onClick={() => openExpModal()}
                className="px-5 py-3 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus size={16} />
                <span>Add Experience</span>
              </button>
            </div>

            <div className="space-y-4">
              {(data.experiences || []).map((exp) => (
                <div key={exp.id} className="bg-card border border-border p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-foreground">{exp.company}</h3>
                      <span className="text-[10px] font-bold px-3 py-0.5 rounded-full bg-muted border border-border text-foreground/80">
                        {exp.duration}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-500 block">{exp.role}</span>
                    <p className="text-xs text-muted-foreground leading-relaxed pt-1 max-w-2xl">{exp.desc}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <button
                      onClick={() => openExpModal(exp)}
                      className="p-2 text-foreground/80 hover:text-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Experience Modal */}
            {isExpModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-card border border-border w-full max-w-xl rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <h3 className="text-lg font-bold text-foreground">
                      {editingExp ? 'Edit Experience' : 'Add Experience Entry'}
                    </h3>
                    <button onClick={() => setIsExpModalOpen(false)} className="p-2 text-muted-foreground hover:text-foreground">
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveExperience} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground/80 mb-1.5">Company Name</label>
                      <input
                        type="text"
                        required
                        value={expForm.company}
                        onChange={e => setExpForm({ ...expForm, company: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/80 mb-1.5">Role / Position Title</label>
                      <input
                        type="text"
                        required
                        value={expForm.role}
                        onChange={e => setExpForm({ ...expForm, role: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/80 mb-1.5">Duration</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2026 - current"
                        value={expForm.duration}
                        onChange={e => setExpForm({ ...expForm, duration: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/80 mb-1.5">Description & Key Achievements</label>
                      <textarea
                        rows={3}
                        required
                        value={expForm.desc}
                        onChange={e => setExpForm({ ...expForm, desc: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                      <button
                        type="button"
                        onClick={() => setIsExpModalOpen(false)}
                        className="px-5 py-2.5 bg-muted rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 cursor-pointer"
                      >
                        Save Entry
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SKILLS MATRIX */}
        {activeTab === 'skills' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-foreground">Skills Matrix & Stack</h1>
                <p className="text-xs text-muted-foreground mt-1">Manage technical stack tools and capabilities badges.</p>
              </div>
              <button
                onClick={() => openSkillModal()}
                className="px-5 py-3 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus size={16} />
                <span>Add Skill Badge</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(data.skills || []).map((skill) => (
                <div key={skill.id} className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{skill.name}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground block mt-0.5">{skill.category}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openSkillModal(skill)}
                      className="p-1.5 text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Skill Modal */}
            {isSkillModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-card border border-border w-full max-w-lg rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <h3 className="text-lg font-bold text-foreground">
                      {editingSkill ? 'Edit Skill Badge' : 'Add Skill Badge'}
                    </h3>
                    <button onClick={() => setIsSkillModalOpen(false)} className="p-2 text-muted-foreground hover:text-foreground">
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveSkill} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground/80 mb-1.5">Skill / Tool Name</label>
                      <input
                        type="text"
                        required
                        value={skillForm.name}
                        onChange={e => setSkillForm({ ...skillForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/80 mb-1.5">Category</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. UI/UX Design or Frontend Framework"
                        value={skillForm.category}
                        onChange={e => setSkillForm({ ...skillForm, category: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                      <button
                        type="button"
                        onClick={() => setIsSkillModalOpen(false)}
                        className="px-5 py-2.5 bg-muted rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 cursor-pointer"
                      >
                        Save Skill
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: PUBLICATIONS & RESEARCH */}
        {activeTab === 'publications' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-foreground">Publications & Research</h1>
                <p className="text-xs text-muted-foreground mt-1">Manage academic research papers, conference articles, and DOI links.</p>
              </div>
              <button
                onClick={() => openPubModal()}
                className="px-5 py-3 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus size={16} />
                <span>Add Publication</span>
              </button>
            </div>

            <div className="space-y-4">
              {(data.publications || []).map((pub) => (
                <div key={pub.id} className="bg-card border border-border p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        {pub.publisher}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {pub.year}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-foreground leading-snug">{pub.title}</h3>
                    <p className="text-xs font-semibold text-foreground/70">Authors: {pub.authors}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{pub.abstract}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                    <button
                      onClick={() => openPubModal(pub)}
                      className="p-2 text-foreground/80 hover:text-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer"
                      title="Edit Publication"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeletePublication(pub.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                      title="Delete Publication"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Publication Modal */}
            {isPubModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-card border border-border w-full max-w-2xl rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <h3 className="text-lg font-bold text-foreground">
                      {editingPub ? 'Edit Publication Details' : 'Add Research Publication'}
                    </h3>
                    <button onClick={() => setIsPubModalOpen(false)} className="p-2 text-muted-foreground hover:text-foreground">
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleSavePublication} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground/80 mb-1.5">Paper / Article Title</label>
                      <input
                        type="text"
                        required
                        value={pubForm.title}
                        onChange={e => setPubForm({ ...pubForm, title: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-foreground/80 mb-1.5">Publisher / Conference Venue</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. IEEE / Springer / ACM"
                          value={pubForm.publisher}
                          onChange={e => setPubForm({ ...pubForm, publisher: e.target.value })}
                          className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-foreground/80 mb-1.5">Publication Year</label>
                        <input
                          type="text"
                          required
                          value={pubForm.year}
                          onChange={e => setPubForm({ ...pubForm, year: e.target.value })}
                          className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/80 mb-1.5">Authors List</label>
                      <input
                        type="text"
                        required
                        placeholder="Humayra Arzooman, et al."
                        value={pubForm.authors}
                        onChange={e => setPubForm({ ...pubForm, authors: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/80 mb-1.5">Abstract Summary</label>
                      <textarea
                        rows={3}
                        required
                        value={pubForm.abstract}
                        onChange={e => setPubForm({ ...pubForm, abstract: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-foreground/80 mb-1.5">DOI Link / URL</label>
                        <input
                          type="text"
                          value={pubForm.link}
                          onChange={e => setPubForm({ ...pubForm, link: e.target.value })}
                          className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-foreground/80 mb-1.5">PDF Paper URL</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={pubForm.pdfUrl}
                            onChange={e => setPubForm({ ...pubForm, pdfUrl: e.target.value })}
                            className="flex-1 px-3 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                          />
                          <label className="px-3 py-2.5 bg-muted border border-border rounded-xl text-xs font-bold hover:bg-muted/80 cursor-pointer flex items-center gap-1">
                            <Upload size={13} />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept=".pdf,application/pdf"
                              onChange={e => handleFileUpload(e, url => setPubForm({ ...pubForm, pdfUrl: url }), 'documents')}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/80 mb-1.5">Research Topic Tags (comma separated)</label>
                      <input
                        type="text"
                        value={pubForm.tags}
                        onChange={e => setPubForm({ ...pubForm, tags: e.target.value })}
                        className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                      <button
                        type="button"
                        onClick={() => setIsPubModalOpen(false)}
                        className="px-5 py-2.5 bg-muted rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 cursor-pointer"
                      >
                        Save Publication
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: CONTACT & SOCIAL LINKS */}
        {activeTab === 'contact' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">Contact & Social Links</h1>
              <p className="text-xs text-muted-foreground mt-1">Manage office imagery, email, location, and social profile links.</p>
            </div>

            <form onSubmit={handleSaveContact} className="bg-card border border-border p-8 rounded-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-foreground/90 mb-2">Office Location</label>
                  <input
                    type="text"
                    value={contactForm.location || ''}
                    onChange={e => setContactForm({ ...contactForm, location: e.target.value })}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/90 mb-2">Contact Email</label>
                  <input
                    type="email"
                    value={contactForm.email || ''}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/90 mb-2">GitHub Profile URL</label>
                  <input
                    type="text"
                    value={contactForm.github || ''}
                    onChange={e => setContactForm({ ...contactForm, github: e.target.value })}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/90 mb-2">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={contactForm.linkedin || ''}
                    onChange={e => setContactForm({ ...contactForm, linkedin: e.target.value })}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/90 mb-2">Figma Profile URL</label>
                  <input
                    type="text"
                    value={contactForm.figma || ''}
                    onChange={e => setContactForm({ ...contactForm, figma: e.target.value })}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/90 mb-2">Twitter Profile URL</label>
                  <input
                    type="text"
                    value={contactForm.twitter || ''}
                    onChange={e => setContactForm({ ...contactForm, twitter: e.target.value })}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/90 mb-2">Office / Studio Image URL</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={contactForm.officeImageUrl || ''}
                    onChange={e => setContactForm({ ...contactForm, officeImageUrl: e.target.value })}
                    className="flex-1 px-4 py-3 bg-muted border border-border rounded-xl text-sm font-medium"
                  />
                  <label className="px-5 py-3 bg-muted border border-border rounded-xl text-xs font-bold hover:bg-muted/80 cursor-pointer flex items-center gap-2 shrink-0">
                    <Upload size={15} />
                    <span>Upload (office/)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileUpload(e, url => setContactForm({ ...contactForm, officeImageUrl: url }), 'office')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-border">
                <button
                  type="submit"
                  className="px-6 py-3 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save size={15} />
                  <span>Save Contact Details</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 8: MEDIA REPOSITORY & FOLDERS */}
        {activeTab === 'media' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2.5">
                  <HardDrive size={24} className="text-emerald-500" />
                  <span>MinIO Foldered Media Repository</span>
                </h1>
                <p className="text-xs text-muted-foreground mt-1">Organize files into folder directories in MinIO S3 object storage.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAddFolderModalOpen(true)}
                  className="px-4 py-2.5 bg-foreground text-background rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <FolderPlus size={15} />
                  <span>New Folder</span>
                </button>

                <a
                  href="http://localhost:9001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-muted border border-border hover:bg-muted/80 rounded-xl text-xs font-bold text-foreground flex items-center gap-2 transition-colors"
                >
                  <ExternalLink size={14} />
                  <span>MinIO Console</span>
                </a>
              </div>
            </div>

            {/* Folder Directories Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/80 flex items-center gap-2">
                  <Folder size={15} className="text-amber-500" />
                  <span>Media Folders</span>
                </h3>
                <span className="text-xs text-muted-foreground">Select a folder to filter files</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                <button
                  onClick={() => setSelectedFolder('all')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedFolder === 'all' 
                      ? 'bg-foreground text-background font-bold border-foreground shadow-sm' 
                      : 'bg-card border-border hover:border-foreground/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Folder size={18} className={selectedFolder === 'all' ? 'text-background' : 'text-amber-500'} />
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                      selectedFolder === 'all' ? 'bg-background/20 text-background' : 'bg-muted text-muted-foreground'
                    }`}>
                      {mediaFiles.length}
                    </span>
                  </div>
                  <span className="text-xs font-bold block mt-2.5">All Files</span>
                </button>

                {customFolders.map((fName) => {
                  const folderCount = mediaFiles.filter(f => f.folder === fName).length;
                  const isSelected = selectedFolder === fName;
                  return (
                    <button
                      key={fName}
                      onClick={() => setSelectedFolder(fName)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-foreground text-background font-bold border-foreground shadow-sm' 
                          : 'bg-card border-border hover:border-foreground/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Folder size={18} className={isSelected ? 'text-background' : 'text-amber-500'} />
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                          isSelected ? 'bg-background/20 text-background' : 'bg-muted text-muted-foreground'
                        }`}>
                          {folderCount}
                        </span>
                      </div>
                      <span className="text-xs font-bold block mt-2.5 truncate" title={fName}>{fName}/</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Folder-Targeted Upload Zone */}
            <div className="bg-card border-2 border-dashed border-border rounded-3xl p-6 md:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-foreground/10 flex items-center justify-center text-foreground shrink-0">
                    <Upload size={22} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-foreground">Upload Asset to MinIO Folder</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Files will be saved into the selected folder directory.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground/80 whitespace-nowrap">Target Folder:</span>
                    <select
                      value={uploadTargetFolder}
                      onChange={e => setUploadTargetFolder(e.target.value)}
                      className="px-3 py-2 bg-muted border border-border rounded-xl text-xs font-bold focus:outline-none"
                    >
                      {customFolders.map(f => (
                        <option key={f} value={f}>{f}/</option>
                      ))}
                    </select>
                  </div>

                  <label className="px-5 py-2.5 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 cursor-pointer shadow-md whitespace-nowrap">
                    <span>Upload File</span>
                    <input
                      type="file"
                      onChange={e => handleFileUpload(e)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Media Asset Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">
                    {selectedFolder === 'all' ? 'All Uploaded Assets' : `Folder: ${selectedFolder}/`}
                  </h3>
                  <span className="text-xs text-muted-foreground">({filteredMediaFiles.length} items)</span>
                </div>
                <button
                  onClick={loadMediaLibrary}
                  className="text-xs text-muted-foreground hover:text-foreground font-semibold"
                >
                  Refresh bucket list
                </button>
              </div>

              {mediaLoading ? (
                <p className="text-xs text-muted-foreground py-8 text-center">Loading MinIO folder objects...</p>
              ) : filteredMediaFiles.length === 0 ? (
                <div className="bg-card border border-border p-12 rounded-2xl text-center space-y-2">
                  <Folder size={32} className="text-muted-foreground mx-auto opacity-50" />
                  <p className="text-xs text-muted-foreground">No files in {selectedFolder === 'all' ? 'MinIO bucket' : `'${selectedFolder}/' folder`}.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredMediaFiles.map((file) => (
                    <div key={file.key} className="bg-card border border-border rounded-2xl overflow-hidden p-3 flex flex-col justify-between space-y-3 group hover:border-foreground/40 transition-colors">
                      <div>
                        <div className="aspect-square bg-muted rounded-xl overflow-hidden relative">
                          <img src={file.url} alt={file.key} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-background/90 backdrop-blur-md rounded-md text-[9px] font-bold text-foreground uppercase tracking-wider">
                            {file.folder}/
                          </span>
                        </div>
                        <div className="pt-2.5">
                          <span className="text-[11px] font-bold text-foreground block truncate" title={file.key}>{file.filename || file.key}</span>
                          <span className="text-[10px] text-muted-foreground block font-medium">{(file.size / 1024).toFixed(1)} KB</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-border">
                        <button
                          onClick={() => handleCopyUrl(file.url)}
                          className="flex-1 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-[10px] font-bold text-foreground flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          {copiedUrl === file.url ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          <span>{copiedUrl === file.url ? 'Copied!' : 'Copy URL'}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteMedia(file.key)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete from MinIO"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Create Folder Modal */}
            {isAddFolderModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-card border border-border w-full max-w-md rounded-3xl p-6 space-y-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <FolderPlus size={18} className="text-amber-500" />
                      <span>Create New MinIO Folder</span>
                    </h3>
                    <button onClick={() => setIsAddFolderModalOpen(false)} className="p-2 text-muted-foreground hover:text-foreground">
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleCreateNewFolder} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground/80 mb-1.5">Folder Directory Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. banners, certificates, case-studies"
                        value={newFolderName}
                        onChange={e => setNewFolderName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium"
                      />
                      <span className="text-[10px] text-muted-foreground block mt-1">Special characters will be sanitized into lower-case alphanumeric directory name.</span>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                      <button
                        type="button"
                        onClick={() => setIsAddFolderModalOpen(false)}
                        className="px-5 py-2 bg-muted rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 cursor-pointer"
                      >
                        Create Folder
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};
