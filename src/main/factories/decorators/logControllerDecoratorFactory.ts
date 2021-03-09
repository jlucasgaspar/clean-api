import { Controller } from '../../../presentation/protocols'
import { LogMongoRepository } from '../../../infra/db/mongodb/LogRepository/LogMongoRepository'
import { LogControllerDecorator } from '../../decorator/LogControllerDecorator'

export const makeLogControllerDecorator = (controller: Controller): Controller => {
    const logErrorRepository = new LogMongoRepository()

    return new LogControllerDecorator(controller, logErrorRepository)
}