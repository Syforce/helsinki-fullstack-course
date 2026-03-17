describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        cy.request('POST', 'http://localhost:3003/api/users', {
            username: 'testuser',
            name: 'Test User',
            password: 'password123'
        })
        cy.visit('/')
    })

    it('Login form is shown', function() {
        cy.contains('Log in to application').should('be.visible')
        cy.get('input[name="Username"]').should('exist')
        cy.get('input[name="Password"]').should('exist')
        cy.get('button[type="submit"]').contains('login').should('exist')
    })

    describe('Login', function() {
        it('succeeds with correct credentials', function() {
            cy.get('input[name="Username"]').type('testuser')
            cy.get('input[name="Password"]').type('password123')
            cy.get('button[type="submit"]').click()

            cy.contains('Test User logged in').should('be.visible')
        })

        it('fails with wrong credentials', function() {
            cy.get('input[name="Username"]').type('testuser')
            cy.get('input[name="Password"]').type('wrong')
            cy.get('button[type="submit"]').click()

            cy.get('.error').should('be.visible')
                .and('contain', 'Wrong username or password')

            cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)') // red

            cy.contains('Log in to application').should('be.visible')
        })
    })

    describe('When logged in', function() {
        beforeEach(function() {
            cy.get('input[name="Username"]').type('testuser')
            cy.get('input[name="Password"]').type('password123')
            cy.get('button[type="submit"]').click()
            cy.contains('Test User logged in').should('be.visible')
        })

        it('A blog can be created', function() {
            cy.contains('button', 'create new blog').click()

            cy.get('[data-testid="title-input"]').type('Test Blog')
            cy.get('[data-testid="author-input"]').type('Test Author')
            cy.get('[data-testid="url-input"]').type('http://test.com')
            cy.contains('button', 'create').click()

            cy.get('.success').should('contain', 'a new blog \'Test Blog\' by Test Author added')
            cy.contains('Test Blog Test Author').should('be.visible')
        })

        it('A blog can be liked', function() {
            cy.contains('button', 'create new blog').click()
            cy.get('[data-testid="title-input"]').type('Like Test')
            cy.get('[data-testid="author-input"]').type('Author')
            cy.get('[data-testid="url-input"]').type('http://like.com')
            cy.contains('button', 'create').click()
            cy.get('.success').should('contain', 'Like Test')

            cy.contains('button', 'view').click()
            cy.get('.likes-count').then($likes => {
                const initialLikes = parseInt($likes.text())
                cy.contains('button', 'like').click()
                // Wait for the likes to update
                cy.get('.likes-count').should('have.text', (initialLikes + 1).toString())
            })
        })

        it('The user who created a blog can delete it', function() {
            cy.contains('button', 'create new blog').click()
            cy.get('[data-testid="title-input"]').type('Delete Test')
            cy.get('[data-testid="author-input"]').type('Author')
            cy.get('[data-testid="url-input"]').type('http://delete.com')
            cy.contains('button', 'create').click()
            cy.get('.success').should('contain', 'Delete Test')

            cy.contains('button', 'view').click()
            cy.on('window:confirm', (text) => {
                expect(text).to.contains('Remove blog Delete Test by Author?')
                return true
            })

            cy.contains('button', 'remove').click()
            cy.contains('Delete Test Author').should('not.exist')
        })

        it('Only the creator can see the delete button', function() {
            cy.contains('button', 'create new blog').click()
            cy.get('[data-testid="title-input"]').type('My Blog')
            cy.get('[data-testid="author-input"]').type('Me')
            cy.get('[data-testid="url-input"]').type('http://my.com')
            cy.contains('button', 'create').click()
            cy.get('.success').should('contain', 'My Blog')

            cy.contains('button', 'view').click()
            cy.contains('button', 'remove').should('be.visible')

            cy.contains('button', 'logout').click()

            cy.request('POST', 'http://localhost:3003/api/users', {
                username: 'another',
                name: 'Another User',
                password: 'password123'
            })

            cy.get('input[name="Username"]').type('another')
            cy.get('input[name="Password"]').type('password123')
            cy.get('button[type="submit"]').click()
            cy.contains('Another User logged in').should('be.visible')

            cy.contains('My Blog Me').should('be.visible')
            cy.contains('button', 'view').click()
            cy.contains('button', 'remove').should('not.exist')
        })

        it('Blogs are ordered by likes, most likes first', function() {
            cy.request('POST', 'http://localhost:3003/api/login', {
                username: 'testuser',
                password: 'password123'
            }).then(response => {
                const token = response.body.token

                cy.request({
                    method: 'POST',
                    url: 'http://localhost:3003/api/blogs',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: { title: 'Blog A', author: 'A', url: 'http://a.com', likes: 2 }
                })
                cy.request({
                    method: 'POST',
                    url: 'http://localhost:3003/api/blogs',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: { title: 'Blog B', author: 'B', url: 'http://b.com', likes: 5 }
                })
                cy.request({
                    method: 'POST',
                    url: 'http://localhost:3003/api/blogs',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: { title: 'Blog C', author: 'C', url: 'http://c.com', likes: 1 }
                })
            })

            cy.reload()
            cy.get('.blog').should('have.length', 3)
            cy.get('.blog').eq(0).should('contain', 'Blog B')
            cy.get('.blog').eq(1).should('contain', 'Blog A')
            cy.get('.blog').eq(2).should('contain', 'Blog C')
        })
    })
})
