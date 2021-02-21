# GIT
git s = git status -s
git c = git add --all && git commit -m
git l = git log --pretty=format:'%C(blue)%h %C(red)%d %C(white)%s - %C(cyan)%cn, %C(green)%cr'

# Ctrl C + Ctrl V
feat: ensure SignUpController returns an error if an invalid email is provided
test: ensure SignUpController returns an error if an invalid email is provided
refactor: move duplicated code to a helper method
chore: add jest configs and scripts