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
      {/* Here we put things that should redirect to the sign up page */}
      <Private wrap={SiteLayout} unauthenticated="signup">
        <Set wrap={BackgroundLayout}>
          <Route path="/recipes/new" page={RecipeNewRecipePage} name="newRecipe" />
          <Route path="/cookbooks/new" page={CookbookNewCookbookPage} name="newCookbook" />
        </Set>
      </Private>
      {/* Here we put things that should redirect to the welcome page */}
      <Private wrap={SiteLayout} unauthenticated="welcome">
        <Route path="/my-recipes" page={RecipeMyRecipesPage} name="myRecipes" />
        <Route path="/my-cookbooks" page={CookbookMyCookbooksPage} name="myCookbooks" />
        <Set wrap={BackgroundLayout}>
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
        <Route path="/example-recipes" page={RecipeExampleRecipesPage} name="exampleRecipes" />
        <Set wrap={BackgroundLayout}>
          <Route path="/recipes/{id}" page={RecipeRecipePage} name="recipe" />
        </Set>
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
