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

import SiteLayout from './layouts/SiteLayout/SiteLayout'

const LoadingPage = () => <Loading />

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Route path="/auth" page={AuthPage} name="auth" />
      <Set whileLoadingAuth={LoadingPage}>
        {/* Here we put things that should redirect to the sign up page */}
        <Private wrap={SiteLayout} unauthenticated="signup" whileLoadingAuth={LoadingPage}>
          <Route path="/cookbooks/new" page={CookbookNewCookbookPage} name="newCookbook" />
        </Private>
        <Private wrap={SiteLayout} unauthenticated="signup" whileLoadingAuth={LoadingPage} bgColor="gray">
          <Route path="/recipes/new" page={RecipeNewRecipePage} name="newRecipe" />
        </Private>

        {/* Here we put things that should redirect to the welcome page */}
        <Private wrap={SiteLayout} unauthenticated="welcome" whileLoadingAuth={LoadingPage}>
          <Route path="/cookbooks/{id}/edit" page={CookbookEditCookbookPage} name="editCookbook" />
          <Route path="/shopping-list" page={ShoppingListPage} name="shoppingList" />
        </Private>
        <Private wrap={SiteLayout} unauthenticated="welcome" whileLoadingAuth={LoadingPage} bgColor="gray">
          <Route path="/settings" page={UserUserSettingsPage} name="settings" />
          <Route path="/recipes/{id}/edit" page={RecipeEditRecipePage} name="editRecipe" />
        </Private>

        <Route path="/" page={WelcomePage} name="welcome" />
        <Set wrap={SiteLayout} whileLoadingAuth={LoadingPage}>
          <Route path="/import-recipes" page={RecipeImportRecipesPage} name="importRecipes" />
          <Route path="/add-recipes" page={RecipeAddRecipesPage} name="addRecipes" />
          <Route path="/login" page={AuthLoginPage} name="login" />
          <Route path="/signup" page={AuthSignupPage} name="signup" />
          <Route path="/signup-and-create-cookbook/{recipeId}" page={AuthSignupAndCreateCookbookPage} name="signupAndCreateCookbook" />
          <Route path="/forgot-password" page={AuthForgotPasswordPage} name="forgotPassword" />
          <Route path="/reset-password" page={AuthResetPasswordPage} name="resetPassword" />
          <Route path="/users/{username}" page={UserUserProfilePage} name="user" />
          <Route path="/users/{username}/fellow-chefs" page={FellowChefsPage} name="fellowChefs" />
          <Route path="/cookbook/{id}" page={CookbookCookbookPage} name="cookbook" />
          <Route path="/recipes/{id}" page={RecipeRecipePage} name="recipe" />
        </Set>
        <Route notfound page={NotFoundPage} />
      </Set>
    </Router>
  )
}

export default Routes
