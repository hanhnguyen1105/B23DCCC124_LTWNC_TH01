import { createContext, useContext, type ReactNode } from 'react'
import type { AssignmentFilter } from './types'

interface FilterContextValue {
  value: AssignmentFilter
  onChange: (value: AssignmentFilter) => void
}

interface FilterTabsProps extends FilterContextValue {
  children: ReactNode
}

interface FilterOptionProps {
  value: AssignmentFilter
  label: string
  count: number
}

const FilterContext = createContext<FilterContextValue | null>(null)

function FilterTabsRoot({ value, onChange, children }: FilterTabsProps) {
  return (
    <FilterContext.Provider value={{ value, onChange }}>
      <div className="filter-tabs" role="group" aria-label="Lọc bài tập">
        {children}
      </div>
    </FilterContext.Provider>
  )
}

function FilterTabOption({ value, label, count }: FilterOptionProps) {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('FilterTabs.Option phải được dùng bên trong FilterTabs.')
  }

  const isSelected = context.value === value
  return (
    <button
      aria-pressed={isSelected}
      className={`filter-option${isSelected ? ' selected' : ''}`}
      onClick={() => context.onChange(value)}
      type="button"
    >
      {label}<span className="filter-count">{count}</span>
    </button>
  )
}

const FilterTabs = Object.assign(FilterTabsRoot, {
  Option: FilterTabOption,
})

export default FilterTabs
