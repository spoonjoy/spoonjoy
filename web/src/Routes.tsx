// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/WelcomePage/WelcomePage.js'         -> WelcomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Set, Private } from '@redwoodjs/router'

import BackgroundLayout from 'src/layouts/BackgroundLayout/BackgroundLayout'

import SiteLayout from './layouts/SiteLayout/SiteLayout'

const Routes = () => {
  return (
    <Router>
      <Private wrap={SiteLayout} unauthenticated="welcome">
        <Route path="/recipes" page={RecipeRecipesPage} name="recipes" />
        <Set wrap={BackgroundLayout}>
          <Route path="/recipes/new" page={RecipeNewRecipePage} name="newRecipe" />
          <Route path="/recipes/{id}/edit" page={RecipeEditRecipePage} name="editRecipe" />
          <Route path="/shopping-list" page={ShoppingListPage} name="shoppingList" />
        </Set>
      </Private>
      <Route path="/" page={WelcomePage} name="welcome" />
      <Set wrap={SiteLayout}>
        <Route path="/login" page={AuthLoginPage} name="login" />
        <Route path="/signup" page={AuthSignupPage} name="signup" />
        <Route path="/forgot-password" page={AuthForgotPasswordPage} name="forgotPassword" />
        <Route path="/reset-password" page={AuthResetPasswordPage} name="resetPassword" />
        <Set wrap={BackgroundLayout}>
          <Route path="/recipes/{id}" page={RecipeRecipePage} name="recipe" />
        </Set>
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
