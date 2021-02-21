# GIT
git s = git status -s
git c = git add --all && git commit -m
git l = git log --pretty=format:'%C(blue)%h %C(red)%d %C(white)%s - %C(cyan)%cn, %C(green)%cr'

# Ctrl C + Ctrl V
feat: ensure DbAddAccount calls encrypter with correct password
test: ensure EmailValidatorAdapter returns true if validator returns true
refactor: move duplicated code to a helper method
chore: add jest configs and scripts