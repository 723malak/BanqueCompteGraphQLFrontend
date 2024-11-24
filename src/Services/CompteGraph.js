// src/services/graphqlService.js
import { gql } from '@apollo/client';

// GraphQL Queries
export const GET_ALL_COMPTES = gql`
    query GetAllComptes($type: TypeCompte, $minSolde: Float) {
        getComptes(type: $type, minSolde: $minSolde) {
            id
            solde
            dateCreation
            type
        }
    }
`;

export const GET_COMPTE_BY_ID = gql`
    query GetCompteById($id: ID!) {
        getCompteById(id: $id) {
            id
            solde
            dateCreation
            type
        }
    }
`;

export const GET_TOTAL_SOLDE = gql`
    query totalSolde {
        totalSolde {
            count
            sum
            average
        }
    }
`;

// GraphQL Mutations
export const SAVE_COMPTE = gql`
    mutation createCompte( $solde:Float, $type:TypeCompte) {
        createCompte(compte: { solde: $solde, type: $type}) {
            id
            solde
            dateCreation
            type
        }
    }
`;

export const DELETE_COMPTE = gql`
    mutation DeleteCompte($id: ID!) {
        deleteCompte(id: $id)
    }
`;

export const GET_ALL_COMPTES_AND_TOTAL_SOLDE = gql`
    query GetAllComptesAndTotalSolde($type: TypeCompte, $minSolde: Float) {
        getComptes(type: $type, minSolde: $minSolde) {
            id
            solde
            dateCreation
            type
        }
        totalSolde {
            count
            sum
            average
        }
    }
`;