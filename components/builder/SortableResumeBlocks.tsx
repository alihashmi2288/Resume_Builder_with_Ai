import * as React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import type { SectionId } from '../../lib/resumeUtils';

export function useBuilderDndSensors() {
  return useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
}

interface SortableDndContextProps {
  items: string[];
  strategy?: 'vertical' | 'rect';
  onReorder: (activeId: string, overId: string) => void;
  children: React.ReactNode;
}

export const SortableDndList: React.FC<SortableDndContextProps> = ({
  items,
  strategy = 'vertical',
  onReorder,
  children,
}) => {
  const sensors = useBuilderDndSensors();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(String(active.id), String(over.id));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items}
        strategy={strategy === 'rect' ? rectSortingStrategy : verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  );
};

interface SortableSectionChipProps {
  id: SectionId;
  label: string;
  enabled: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

export const SortableSectionChip: React.FC<SortableSectionChipProps> = ({
  id,
  label,
  enabled,
  onToggle,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      role="listitem"
      data-section-chip={id}
      className={`inline-flex items-center gap-0.5 h-7 pl-1.5 pr-1 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 select-none ${
        isDragging
          ? 'opacity-80 ring-2 ring-[#4262ff] border-[#4262ff] bg-[#4262ff]/10 shadow-md z-20 relative'
          : enabled
            ? 'bg-secondary border-border text-foreground hover:border-primary/40'
            : 'bg-muted/30 border-dashed border-border text-muted-foreground opacity-75 hover:opacity-100'
      }`}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        data-section-chip-handle={id}
        {...attributes}
        {...listeners}
        title={`Drag to reorder ${label}`}
        aria-label={`Reorder ${label} section`}
        className="inline-flex items-center gap-1.5 h-5 pr-1 cursor-grab active:cursor-grabbing touch-none focus:outline-none rounded"
      >
        <GripVertical className="size-3 text-muted-foreground/70 shrink-0" aria-hidden="true" />
        <span className={enabled ? '' : 'line-through'}>{label}</span>
      </button>
      <button
        type="button"
        onClick={onToggle}
        onPointerDown={(e) => e.stopPropagation()}
        aria-pressed={enabled}
        aria-label={enabled ? `Remove ${label} section from resume` : `Include ${label} section on resume`}
        title={enabled ? `Hide ${label}` : `Show ${label}`}
        className="size-5 rounded flex items-center justify-center hover:bg-background/80 transition-colors shrink-0 cursor-pointer"
      >
        {enabled
          ? <Eye className="size-3 text-emerald-500 shrink-0" aria-hidden="true" />
          : <EyeOff className="size-3 shrink-0" aria-hidden="true" />}
      </button>
    </div>
  );
};

interface SortableSectionWrapperProps {
  id: SectionId;
  className?: string;
  children: (handleProps: {
    setActivatorNodeRef: (element: HTMLElement | null) => void;
    attributes: Record<string, any>;
    listeners: Record<string, any> | undefined;
    isDragging: boolean;
  }) => React.ReactNode;
}

export const SortableSectionWrapper: React.FC<SortableSectionWrapperProps> = ({
  id,
  className = '',
  children,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-sortable-section={id}
      className={`${className} ${
        isDragging ? 'relative z-20 ring-2 ring-[#4262ff] bg-card shadow-lg rounded-xl' : ''
      }`}
    >
      {children({
        setActivatorNodeRef,
        attributes: attributes as Record<string, any>,
        listeners: listeners as Record<string, any> | undefined,
        isDragging,
      })}
    </div>
  );
};

interface SortableEntryCardProps {
  id: string;
  title: string;
  kindLabel: string;
  actions: React.ReactNode;
  children: React.ReactNode;
}

export const SortableEntryCard: React.FC<SortableEntryCardProps> = ({
  id,
  title,
  kindLabel,
  actions,
  children,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-entry-card={id}
      className={`p-4 border rounded-2xl bg-card space-y-3 transition-shadow ${
        isDragging
          ? 'relative z-20 border-[#4262ff] ring-2 ring-[#4262ff]/40 shadow-xl opacity-90'
          : 'border-border/80 hover:border-primary/40'
      }`}
    >
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/60">
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            type="button"
            ref={setActivatorNodeRef}
            data-entry-drag-handle={id}
            {...attributes}
            {...listeners}
            title={`Drag to reorder ${kindLabel}`}
            aria-label={`Drag to reorder ${title || kindLabel}`}
            className="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground/70 hover:text-foreground hover:bg-secondary cursor-grab active:cursor-grabbing touch-none shrink-0"
          >
            <GripVertical className="size-4" aria-hidden="true" />
          </button>
          <span className="text-xs font-semibold text-foreground/90 truncate">
            {title || kindLabel}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">{actions}</div>
      </div>
      {children}
    </div>
  );
};
