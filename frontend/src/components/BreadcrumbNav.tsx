import React from 'react';
import { Breadcrumb } from 'antd';

export default function BreadcrumbNav({ path, onNavigate }: { path: string; onNavigate: (p: string) => void; }) {
  const parts = path ? path.split('/').filter(Boolean) : [];
  const items = [{ name: '我的文件', p