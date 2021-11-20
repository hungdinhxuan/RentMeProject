import AOS from "aos"
import { PrivateRoute } from "components/Layouts/PrivateRoute"
import { PublicRoute } from "components/Layouts/PublicRoute"
import { AdminRoute } from "components/Layouts/AdminRoute"
import Loading from "components/Loading"
import PageNotFound from "components/PageNotFound"
import routes from "constants/routes"
import { React, Suspense } from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"


AOS.init()

function App () {
  const showLayout = (routes) => {
    if (routes && routes.length > 0) {
      return routes.map((route, index) => {
        if (
          route.path === "/signin" ||
          route.path === "/signup" ||
          route.path === "/forgot-password" ||
          route.path === "/"
        ) {
          return (
            <PublicRoute
              key={index}
              exact={route.exact}
              path={route.path}
              component={route.main}
              layout={route.layout}
            />
          )
        } else if (route.path === "/admin") {
          return (
            <AdminRoute
              key={index}
              exact={route.exact}
              path={route.path}
              component={route.main}
              layout={route.layout}
            />
          )
        } else {
          // Private route yêu cầu authentication
          return (
            <PrivateRoute
              key={index}
              exact={route.exact}
              path={route.path}
              component={route.main}
              layout={route.layout}
            />
          )
        }
      })
    }
  }
  return (
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
        <Switch>
          {showLayout(routes)}
          <Route path="*" component={PageNotFound} />
        </Switch>

        
      </BrowserRouter>
    </Suspense>
  )
}
export default App
