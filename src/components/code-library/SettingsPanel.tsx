import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { EditorSettings } from '@/hooks/useEditorSettings';

interface SettingsPanelProps {
  settings: EditorSettings;
  onUpdateSetting: <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => void;
  onReset: () => void;
}

export function SettingsPanel({ settings, onUpdateSetting, onReset }: SettingsPanelProps) {
  return (
    <div className="h-full flex flex-col bg-[#252526] text-[#cccccc]">
      {/* Header */}
      <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#bbbbbb] border-b border-[#3c3c3c] flex items-center justify-between">
        <span>Settings</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-6 px-2 text-xs text-[#858585] hover:text-[#cccccc]"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Editor Section */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#bbbbbb] mb-3">
              Editor
            </h3>
            <div className="space-y-4">
              {/* Font Size */}
              <div className="flex items-center justify-between">
                <Label className="text-sm text-[#cccccc]">Font Size</Label>
                <Select
                  value={String(settings.fontSize)}
                  onValueChange={(v) => onUpdateSetting('fontSize', Number(v))}
                >
                  <SelectTrigger className="w-24 h-7 bg-[#3c3c3c] border-[#3c3c3c] text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[12, 13, 14, 15, 16, 18, 20, 22, 24].map(size => (
                      <SelectItem key={size} value={String(size)}>{size}px</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tab Size */}
              <div className="flex items-center justify-between">
                <Label className="text-sm text-[#cccccc]">Tab Size</Label>
                <Select
                  value={String(settings.tabSize)}
                  onValueChange={(v) => onUpdateSetting('tabSize', Number(v))}
                >
                  <SelectTrigger className="w-24 h-7 bg-[#3c3c3c] border-[#3c3c3c] text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 spaces</SelectItem>
                    <SelectItem value="4">4 spaces</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Word Wrap */}
              <div className="flex items-center justify-between">
                <Label className="text-sm text-[#cccccc]">Word Wrap</Label>
                <Switch
                  checked={settings.wordWrap}
                  onCheckedChange={(v) => onUpdateSetting('wordWrap', v)}
                />
              </div>

              {/* Minimap */}
              <div className="flex items-center justify-between">
                <Label className="text-sm text-[#cccccc]">Minimap</Label>
                <Switch
                  checked={settings.minimap}
                  onCheckedChange={(v) => onUpdateSetting('minimap', v)}
                />
              </div>

              {/* Line Numbers */}
              <div className="flex items-center justify-between">
                <Label className="text-sm text-[#cccccc]">Line Numbers</Label>
                <Switch
                  checked={settings.lineNumbers}
                  onCheckedChange={(v) => onUpdateSetting('lineNumbers', v)}
                />
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#bbbbbb] mb-3">
              Preview
            </h3>
            <div className="space-y-4">
              {/* Auto Refresh */}
              <div className="flex items-center justify-between">
                <Label className="text-sm text-[#cccccc]">Auto Refresh</Label>
                <Switch
                  checked={settings.autoRefresh}
                  onCheckedChange={(v) => onUpdateSetting('autoRefresh', v)}
                />
              </div>

              {/* Refresh Delay */}
              <div className="flex items-center justify-between">
                <Label className="text-sm text-[#cccccc]">Refresh Delay</Label>
                <Select
                  value={String(settings.refreshDelay)}
                  onValueChange={(v) => onUpdateSetting('refreshDelay', Number(v))}
                >
                  <SelectTrigger className="w-24 h-7 bg-[#3c3c3c] border-[#3c3c3c] text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">300ms</SelectItem>
                    <SelectItem value="500">500ms</SelectItem>
                    <SelectItem value="1000">1000ms</SelectItem>
                    <SelectItem value="2000">2000ms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Theme Section */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#bbbbbb] mb-3">
              Theme
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-[#cccccc]">Editor Theme</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(v) => onUpdateSetting('theme', v)}
                >
                  <SelectTrigger className="w-28 h-7 bg-[#3c3c3c] border-[#3c3c3c] text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vs-dark">Dark</SelectItem>
                    <SelectItem value="vs-light">Light</SelectItem>
                    <SelectItem value="hc-black">High Contrast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
