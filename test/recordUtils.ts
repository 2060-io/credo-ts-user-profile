import type {
  BaseRecord,
  RecordSavedEvent,
  RecordDeletedEvent,
  RecordUpdatedEvent,
  Agent,
  BaseEvent,
} from '@aries-framework/core'
import type { Constructor } from '@aries-framework/core/build/utils/mixins'

import { RepositoryEventTypes } from '@aries-framework/core'
import { map, filter, pipe } from 'rxjs'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BaseRecordAny = BaseRecord<any, any, any>
type RecordClass<R extends BaseRecordAny> = Constructor<R> & { type: string }
export interface RecordsState<R extends BaseRecordAny> {
  loading: boolean
  records: R[]
}

export const addRecord = <R extends BaseRecordAny>(record: R, state: RecordsState<R>): RecordsState<R> => {
  const newRecordsState = [...state.records]
  newRecordsState.unshift(record)
  return {
    loading: state.loading,
    records: newRecordsState,
  }
}

export const updateRecord = <R extends BaseRecordAny>(record: R, state: RecordsState<R>): RecordsState<R> => {
  const newRecordsState = [...state.records]
  const index = newRecordsState.findIndex((r) => r.id === record.id)
  if (index > -1) {
    newRecordsState[index] = record
  }
  return {
    loading: state.loading,
    records: newRecordsState,
  }
}

export const removeRecord = <R extends BaseRecordAny>(record: R, state: RecordsState<R>): RecordsState<R> => {
  const newRecordsState = state.records.filter((r) => r.id !== record.id)
  return {
    loading: state.loading,
    records: newRecordsState,
  }
}

const filterByType = <R extends BaseRecordAny>(recordClass: RecordClass<R>) => {
  return pipe(
    map((event: BaseEvent) => (event.payload as Record<string, R>).record),
    filter((record: R) => record.type === recordClass.type)
  )
}

export const recordsAddedByType = <R extends BaseRecordAny>(agent: Agent | undefined, recordClass: RecordClass<R>) => {
  if (!agent) {
    throw new Error('Agent is required to subscribe to events')
  }
  return agent?.events.observable<RecordSavedEvent<R>>(RepositoryEventTypes.RecordSaved).pipe(filterByType(recordClass))
}

export const recordsUpdatedByType = <R extends BaseRecordAny>(
  agent: Agent | undefined,
  recordClass: RecordClass<R>
) => {
  if (!agent) {
    throw new Error('Agent is required to subscribe to events')
  }
  return agent?.events
    .observable<RecordUpdatedEvent<R>>(RepositoryEventTypes.RecordUpdated)
    .pipe(filterByType(recordClass))
}

export const recordsRemovedByType = <R extends BaseRecordAny>(
  agent: Agent | undefined,
  recordClass: RecordClass<R>
) => {
  if (!agent) {
    throw new Error('Agent is required to subscribe to events')
  }
  return agent?.events
    .observable<RecordDeletedEvent<R>>(RepositoryEventTypes.RecordDeleted)
    .pipe(filterByType(recordClass))
}
