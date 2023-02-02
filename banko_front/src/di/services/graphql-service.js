import { gql } from '@apollo/client'

class GraphQLService {
    algoReaction() {
        return gql`
            mutation algoReaction($input: AlgoReaction!) {
                algoReaction(input: $input) {
                    id
                }
            }
        `
    }

    getCurrentUser() {
        return gql`
            query getCurrentUser {
                getCurrentUser {
                    id
                    nickname
                    email
                    isAdmin
                    likedAlgorithms {
                        id
                    }
                    dislikedAlgorithms {
                        id
                    }
                }
            }
        `
    }

    getAllTags() {
        return gql`
            query tags {
                tags {
                    id
                    name
                    color
                    group {
                        id
                        name
                    }
                }
            }
        `
    }

    getAllLanguages() {
        return gql`
            query getLanguages {
                languages {
                    id
                    name
                    isActive
                    tags {
                        id
                        name
                        color
                    }
                }
            }
        `
    }

    signup() {
        return gql`
            mutation signup($user: NewUser!) {
                signup(input: $user) {
                    id
                    nickname
                    created_at
                    updated_at
                    deleted_at
                    isAdmin
                    isBanned
                    isDeleted
                    level {
                        id
                        name
                    }
                    allCreatedAlgorithms {
                        id
                        name
                    }
                }
            }
        `
    }

    login() {
        return gql`
            mutation login($input: LoginUserInput!) {
                login(loginUserInput: $input) {
                    user {
                        id
                        nickname
                        email
                        isAdmin
                        likedAlgorithms {
                            id
                        }
                        dislikedAlgorithms {
                            id
                        }
                    }
                    access_token
                }
            }
        `
    }

    createAlgo() {
        return gql`
            mutation createAlgo($input: NewAlgorithm!) {
                createAlgorithm(input: $input) {
                    id
                    name
                }
            }
        `
    }

    queryAlgorithmById() {
        return gql`
            query queryAlgorithmById($id: String!, $increment_visit: Boolean!) {
                algorithm(id: $id, increment_visit: $increment_visit) {
                    id
                    name
                    tags {
                        id
                        name
                        color
                    }
                    user {
                        id
                        email
                        nickname
                    }
                    likes
                    dislikes
                    description
                    isActive
                    isDeleted
                    created_at
                    updated_at
                    deleted_at
                    supportedLanguages {
                        name
                    }
                    links
                    complexity
                    visiting {
                        id
                        date
                        visited
                    }
                    codes {
                        id
                        code
                        description
                        language {
                            id
                            name
                        }
                    }
                    examplesOfUse {
                        id
                        code
                        description
                        language {
                            id
                            name
                        }
                    }
                    explain_steps {
                        id
                        description
                    }
                }
            }
        `
    }

    queryFilteredAlgorithms() {
        return gql`
            query filteredAlgorithms($selected: FilterOptions!) {
                filteredAlgorithms(input: $selected) {
                    algorithms {
                        id
                        name
                        tags {
                            id
                            name
                            color
                        }
                        user {
                            id
                            email
                            nickname
                            level {
                                id
                                name
                            }
                        }
                        likes
                        dislikes
                        description
                        isActive
                        isDeleted
                        created_at
                        updated_at
                        deleted_at
                        supportedLanguages {
                            name
                        }
                        links
                        complexity
                        visiting {
                            id
                            date
                            visited
                        }
                    }
                    allAlgosLength
                }
            }
        `
    }

    queryTestAPI() {
        return gql`
            query GetExchangeRates {
                rates(currency: "USD") {
                    currency
                    rate
                }
            }
        `
    }

    queryLevels() {
        return gql`
            query levels {
                levels {
                    id
                    name
                    description
                }
            }
        `
    }

    queryAllGroups() {
        return gql`
            query groups {
                groups {
                    id
                    name
                    showNumber
                    tags {
                        id
                        name
                        color
                    }
                }
            }
        `
    }

    queryAlgorithmsHome() {
        return gql`
            query algorithms {
                algorithms {
                    id
                    name
                    tags {
                        id
                        name
                        color
                    }
                    user {
                        id
                        email
                        nickname
                    }
                    likes
                    dislikes
                    description
                    isActive
                    isDeleted
                    created_at
                    updated_at
                    deleted_at
                    supportedLanguages {
                        name
                    }
                    links
                    complexity
                    visiting {
                        id
                        date
                        visited
                    }
                }
            }
        `
    }

    userForAccountPage() {
        return gql`
            query userForAccountPage($nickname: String!) {
                userForAccountPage(nickname: $nickname) {
                    id
                    nickname
                    isAdmin
                    levelName
                    totalLikes
                    totalDislikes
                    lastAlgos {
                        id
                        name
                    }
                    allAlgosLength
                    algosToNextLevel
                    nextLevelName
                    visitsPerDate {
                        date
                        visits
                    }
                    languagesDistribution {
                        name
                        percent
                        count
                        color
                    }
                }
            }
        `
    }

    userAlgorithmsPerPage() {
        return gql`
            query userAlgorithmsPerPage($input: InputAlgorithmsPerPage!) {
                userAlgorithmsPerPage(input: $input) {
                    algorithms {
                        id
                        name
                        likes
                        dislikes
                        complexity
                        description
                        created_at
                        tags {
                            id
                            name
                            color
                        }
                    }
                    allAlgosLength
                }
            }
        `
    }

    //! AdminPanel
    //? Levels
    levelsForAdminPanel() {
        return gql`
            query levels {
                levels {
                    id
                    name
                    minAddedAlgorithms
                    maxAddedAlgorithms
                    description
                }
            }
        `
    }

    createLevel() {
        return gql`
            mutation createLevel($level: NewLevel!) {
                createLevel(input: $level) {
                    id
                    name
                }
            }
        `
    }

    updateLevel() {
        return gql`
            mutation updateLevel($id: String!, $level: NewLevelWithNull!) {
                updateLevel(id: $id, input: $level) {
                    id
                    name
                }
            }
        `
    }

    deleteLevel() {
        return gql`
            mutation deleteLevel($id: String!) {
                deleteLevel(id: $id) {
                    id
                    name
                }
            }
        `
    }

    //? Tags
    tagsForAdminPanel() {
        return gql`
            query tagsForAdminPanel {
                tagsForAdminPanel {
                    id
                    name
                    color
                    isActive
                    group {
                        id
                        name
                    }
                    user {
                        id
                        nickname
                    }
                }
            }
        `
    }
    createTagAdmin() {
        return gql`
            mutation createTagAdmin($input: NewTag!) {
                createTagAdmin(input: $input) {
                    id
                    name
                }
            }
        `
    }

    updateTagAdmin() {
        return gql`
            mutation updateTagAdmin($id: String!, $input: NewTagWithNull!) {
                updateTagAdmin(id: $id, input: $input) {
                    id
                    name
                }
            }
        `
    }

    deleteTagAdmin() {
        return gql`
            mutation deleteTagAdmin($id: String!) {
                deleteTagAdmin(id: $id) {
                    id
                    name
                }
            }
        `
    }

    //? groups
    groupsAdmin() {
        return gql`
            query groupsAdmin {
                groupsAdmin {
                    id
                    name
                }
            }
        `
    }

    groupsForAdminPanel() {
        return gql`
            query groupsPopulatedAdmin {
                groupsPopulatedAdmin {
                    id
                    name
                    showNumber
                    isActive
                }
            }
        `
    }

    createGroupAdmin() {
        return gql`
            mutation createGroupAdmin($input: NewGroup!) {
                createGroupAdmin(input: $input) {
                    id
                    name
                }
            }
        `
    }

    updateGroupAdmin() {
        return gql`
            mutation updateGroupAdmin($id: String!, $input: NewGroupWithNull!) {
                updateGroupAdmin(id: $id, input: $input) {
                    id
                    name
                }
            }
        `
    }

    deleteGroupAdmin() {
        return gql`
            mutation deleteGroupAdmin($id: String!) {
                deleteGroupAdmin(id: $id) {
                    id
                    name
                }
            }
        `
    }

    //? users
    usersForAdminPanel() {
        return gql`
            query usersForAdminPanel {
                usersForAdminPanel {
                    id
                    email
                    nickname
                    isAdmin
                    isBanned
                }
            }
        `
    }

    updateUserAdmin() {
        return gql`
            mutation updateUserAdmin($id: String!, $input: NewUserWithNull!) {
                updateUserAdmin(id: $id, input: $input) {
                    id
                    nickname
                }
            }
        `
    }

    //? languages
    languagesForAdminPanel() {
        return gql`
            query languagesForAdminPanel {
                languagesForAdminPanel {
                    id
                    name
                    isActive
                    tags {
                        id
                        name
                    }
                }
            }
        `
    }

    freeTagsForLanguagesTable() {
        return gql`
            query freeTagsForLanguagesTable {
                freeTagsForLanguagesTable {
                    id
                    name
                }
            }
        `
    }

    createLanguageAdmin() {
        return gql`
            mutation createLanguageAdmin($input: NewLanguage!) {
                createLanguageAdmin(input: $input) {
                    id
                    name
                }
            }
        `
    }

    updateLanguageAdmin() {
        return gql`
            mutation updateLanguageAdmin(
                $id: String!
                $input: NewLanguageWithNull!
            ) {
                updateLanguageAdmin(id: $id, input: $input) {
                    id
                    name
                }
            }
        `
    }

    deleteLanguageAdmin() {
        return gql`
            mutation deleteLanguageAdmin($id: String!) {
                deleteLanguageAdmin(id: $id) {
                    id
                    name
                }
            }
        `
    }

    //? Algorithms

    algorithmsForAdminPanel() {
        return gql`
            query algorithmsForAdminPanel {
                algorithmsForAdminPanel {
                    id
                    name
                    isActive
                }
            }
        `
    }

    updateAlgorithmAdmin() {
        return gql`
            mutation updateAlgorithmAdmin(
                $id: String!
                $input: NewAlgorithmAdmin!
            ) {
                updateAlgorithmAdmin(id: $id, input: $input) {
                    id
                    name
                }
            }
        `
    }

    //! AdminPanel end
}

export default GraphQLService
