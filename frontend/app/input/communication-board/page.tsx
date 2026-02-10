'use client'

import React, { useState } from 'react'
import { useFluentContext } from '@/lib/fluent-context'
import { recordInput } from '@/lib/adaptive-engine'
import { ModePageLayout } from '@/components/mode-page-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LayoutGrid, Plus, Heart, Utensils, Home, Activity, MessageCircle } from 'lucide-react'

interface BoardItem {
    emoji: string
    label: string
    category: string
}

const DEFAULT_ITEMS: BoardItem[] = [
    // Needs
    { emoji: '💧', label: 'Water', category: 'Needs' },
    { emoji: '🍽️', label: 'Food', category: 'Needs' },
    { emoji: '🚽', label: 'Bathroom', category: 'Needs' },
    { emoji: '💊', label: 'Medicine', category: 'Needs' },
    { emoji: '😴', label: 'Sleep', category: 'Needs' },
    { emoji: '🤕', label: 'Pain', category: 'Needs' },
    // Feelings
    { emoji: '😊', label: 'Happy', category: 'Feelings' },
    { emoji: '😢', label: 'Sad', category: 'Feelings' },
    { emoji: '😠', label: 'Frustrated', category: 'Feelings' },
    { emoji: '😰', label: 'Anxious', category: 'Feelings' },
    { emoji: '🥰', label: 'Loved', category: 'Feelings' },
    { emoji: '😴', label: 'Tired', category: 'Feelings' },
    // Responses
    { emoji: '✅', label: 'Yes', category: 'Responses' },
    { emoji: '❌', label: 'No', category: 'Responses' },
    { emoji: '🤷', label: 'Maybe', category: 'Responses' },
    { emoji: '🙏', label: 'Please', category: 'Responses' },
    { emoji: '❤️', label: 'Thank you', category: 'Responses' },
    { emoji: '👋', label: 'Hello', category: 'Responses' },
    // Actions
    { emoji: '📞', label: 'Call someone', category: 'Actions' },
    { emoji: '📧', label: 'Send email', category: 'Actions' },
    { emoji: '🏠', label: 'Go home', category: 'Actions' },
    { emoji: '🚗', label: 'Go out', category: 'Actions' },
    { emoji: '📺', label: 'Watch TV', category: 'Actions' },
    { emoji: '🎵', label: 'Play music', category: 'Actions' },
    // People
    { emoji: '👨‍⚕️', label: 'Doctor', category: 'People' },
    { emoji: '👪', label: 'Family', category: 'People' },
    { emoji: '👨‍👩‍👧', label: 'Parents', category: 'People' },
    { emoji: '👫', label: 'Friend', category: 'People' },
    { emoji: '🆘', label: 'Help!', category: 'People' },
    { emoji: '👩‍⚕️', label: 'Nurse', category: 'People' },
]

const CATEGORIES = ['All', 'Needs', 'Feelings', 'Responses', 'Actions', 'People']
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    All: <LayoutGrid className="h-4 w-4" />,
    Needs: <Activity className="h-4 w-4" />,
    Feelings: <Heart className="h-4 w-4" />,
    Responses: <MessageCircle className="h-4 w-4" />,
    Actions: <Home className="h-4 w-4" />,
    People: <Utensils className="h-4 w-4" />,
}

export default function CommunicationBoardPage() {
    const { appendOutput } = useFluentContext()
    const [items, setItems] = useState(DEFAULT_ITEMS)
    const [activeCategory, setActiveCategory] = useState('All')
    const [lastSelected, setLastSelected] = useState<string | null>(null)
    const [addingNew, setAddingNew] = useState(false)
    const [newEmoji, setNewEmoji] = useState('🔵')
    const [newLabel, setNewLabel] = useState('')
    const [newCategory, setNewCategory] = useState('Needs')

    const filteredItems = activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory)

    const selectItem = (item: BoardItem) => {
        appendOutput(item.label + ' ')
        setLastSelected(item.label)
        recordInput('board', true, 500, item.label)
        if (navigator.vibrate) navigator.vibrate(30)
        setTimeout(() => setLastSelected(null), 600)
    }

    const addItem = () => {
        if (!newLabel.trim()) return
        setItems(prev => [...prev, { emoji: newEmoji, label: newLabel, category: newCategory }])
        setNewEmoji('🔵')
        setNewLabel('')
        setAddingNew(false)
    }

    return (
        <ModePageLayout
            title="Communication Board"
            description="Symbol-based communication for non-verbal users. Tap an icon to express needs, feelings, and actions."
            icon={<LayoutGrid className="h-6 w-6 text-white" />}
            color="bg-yellow-600"
            helpContent="Tap any symbol to add its meaning to your output. Use categories to filter. You can add custom symbols too."
        >
            <div className="space-y-4">
                {/* Category tabs */}
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 border-border font-bold text-xs transition-all
                shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]
                ${activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-card'}`}
                            aria-pressed={activeCategory === cat}
                        >
                            {CATEGORY_ICONS[cat]}
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Symbol grid */}
                <Card className="p-4 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {filteredItems.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => selectItem(item)}
                                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-border transition-all
                  shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]
                  ${lastSelected === item.label ? 'bg-primary text-primary-foreground scale-105' : 'bg-card hover:bg-muted'}`}
                                aria-label={item.label}
                            >
                                <span className="text-3xl">{item.emoji}</span>
                                <span className="text-[11px] font-bold leading-tight text-center">{item.label}</span>
                            </button>
                        ))}

                        {/* Add new button */}
                        <button
                            onClick={() => setAddingNew(true)}
                            className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl border-2 border-dashed border-border hover:bg-muted transition-all"
                            aria-label="Add new symbol"
                        >
                            <Plus className="h-8 w-8 text-muted-foreground" />
                            <span className="text-[11px] font-bold text-muted-foreground">Add New</span>
                        </button>
                    </div>
                </Card>

                {/* Add new item form */}
                {addingNew && (
                    <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="font-black text-sm mb-3">Add Custom Symbol</h3>
                        <div className="flex flex-wrap gap-3 items-end">
                            <div>
                                <label className="text-xs font-bold block mb-1">Emoji</label>
                                <input type="text" value={newEmoji} onChange={(e) => setNewEmoji(e.target.value)}
                                    className="w-16 px-2 py-1.5 border-2 border-border rounded-lg text-xl text-center bg-input" />
                            </div>
                            <div className="flex-1 min-w-[150px]">
                                <label className="text-xs font-bold block mb-1">Label</label>
                                <input type="text" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="e.g. Glasses"
                                    className="w-full px-3 py-1.5 border-2 border-border rounded-lg text-sm font-medium bg-input" />
                            </div>
                            <div>
                                <label className="text-xs font-bold block mb-1">Category</label>
                                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                                    className="px-2 py-1.5 border-2 border-border rounded-lg text-xs font-bold bg-input">
                                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <Button onClick={addItem} className="font-bold border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                Add
                            </Button>
                            <Button variant="outline" onClick={() => setAddingNew(false)}
                                className="font-bold border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                Cancel
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </ModePageLayout>
    )
}
