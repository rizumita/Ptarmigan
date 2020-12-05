import { itemParser } from './schemaParser'
import { ParseSuccess } from './parser/parseResult'

describe('SchemaParser', () => {
  test.each([
    ['project: manabo2', ['project', null, 'manabo2'], ''],
    ['project: manabo2 student', ['project', null, 'manabo2 student'], '']
  ])('parse succeeded', (input, value, next) =>
    expect(itemParser.parse(input)).toStrictEqual(new ParseSuccess(value, next))
  )
})

const schemaString = 'project: manabo2'
// description: manabo2 firestore schema
// constant Ver = v1

// type AvatarURL: string
// type ID: int

// type SchoolYear {
//   id: ID
//   text: string
//   needs_target_university: bool
// }

// type TargetUniversityLevel {
//   id: ID
//   text: string
// }

// type FacultyType {
//   id: ID
//   text: String
// }

// type Avatar {
//   id: ID
//   url: AvatarURL
// }

// collection /public/$Ver/registrations/%organization_id {
//   school_years: [SchoolYear]
//   target_university_levels: [TargetUniversityLevel]
//   faculty_types: [FacultyType]
// }

// collection public {
//   document $Var {
//     collection registrations {
//       document %registration_id {
//         school_years: [SchoolYear]
//         target_university_levels: [TargetUniversityLevel]
//         faculty_types: [FacultyType]
//         avatars: [Avatar]
//     }
//   }
// }
