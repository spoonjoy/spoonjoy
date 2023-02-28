// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/WelcomePage/WelcomePage.js'         -> WelcomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Set, Private } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import Loading from 'src/components/Loading/Loading'
import BackgroundLayout from 'src/layouts/BackgroundLayout/BackgroundLayout'

import SiteLayout from './layouts/SiteLayout/SiteLayout'

const LoadingPage = () => <Loading />

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Set whileLoadingAuth={LoadingPage}>
        {/* Here we put things that should redirect to the sign up page */}
        <Private wrap={SiteLayout} unauthenticated="signup" whileLoadingAuth={LoadingPage}>
          <Set wrap={BackgroundLayout}>
            <Route path="/recipes/new" page={RecipeNewRecipePage} name="newRecipe" />
            <Route path="/cookbooks/new" page={CookbookNewCookbookPage} name="newCookbook" />
          </Set>
        </Private>
        {/* Here we put things that should redirect to the welcome page */}
        <Private wrap={SiteLayout} unauthenticated="welcome" whileLoadingAuth={LoadingPage}>
          <Set wrap={BackgroundLayout}>
            <Route path="/recipes/{id}/edit" page={RecipeEditRecipePage} name="editRecipe" />
            <Route path="/cookbooks/{id}/edit" page={CookbookEditCookbookPage} name="editCookbook" />
            <Route path="/shopping-list" page={ShoppingListPage} name="shoppingList" />
          </Set>
        </Private>
        <Route path="/" page={WelcomePage} name="welcome" />
        <Set wrap={SiteLayout} whileLoadingAuth={LoadingPage}>
          <Route path="/import-recipes" page={RecipeImportRecipesPage} name="importRecipes" />
          <Route path="/login" page={AuthLoginPage} name="login" />
          <Route path="/signup" page={AuthSignupPage} name="signup" />
          <Route path="/signup-and-create-cookbook/{recipeId}" page={AuthSignupAndCreateCookbookPage} name="signupAndCreateCookbook" />
          <Route path="/forgot-password" page={AuthForgotPasswordPage} name="forgotPassword" />
          <Route path="/reset-password" page={AuthResetPasswordPage} name="resetPassword" />
          <Route path="/users/{username}" page={UserUserProfilePage} name="user" />
          <Set wrap={BackgroundLayout}>
            <Route path="/recipes/{id}" page={RecipeRecipePage} name="recipe" />
            <Route path="/cookbook/{id}" page={CookbookCookbookPage} name="cookbook" />
            <Route path="/{username}/cookbooks" page={CookbookCookbooksPage} name="cookbooks" />
          </Set>
        </Set>
        <Route notfound page={NotFoundPage} />
      </Set>
    </Router>
  )
}

export default Routes
