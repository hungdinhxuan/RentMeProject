import PageNotFound from 'components/PageNotFound'
import React from 'react'
import { Redirect } from 'react-router'

export default function NotFound() {
    return (
        <Redirect to="/404"/>
    )
}
