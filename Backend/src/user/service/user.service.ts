import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { UserDto } from "../dto/user.dto";
import { UserEntity } from "../entity/user.entity";

@Injectable()
export class UserService {
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  }

  async create(userDto: UserDto, password: string): Promise<UserDto> {
    try {
      const existingUser = await this.findByEmail(userDto.email);
      if (existingUser) {
        throw new HttpException("Email déjà utilisé.", HttpStatus.BAD_REQUEST);
      }

      if (!this.validatePassword(password)) {
        throw new HttpException(
          "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre.",
          HttpStatus.BAD_REQUEST
        );
      }

      const hashedPassword = await bcrypt.hash(password, this.saltRounds);

      const user = new UserEntity();
      Object.assign(user, userDto);
      user.password = hashedPassword;

      const savedUser = await this.userRepository.save(user);
      return savedUser;
    } catch (error) {
      throw new HttpException(
        `Erreur lors de la création de l'utilisateur : ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(userId: number): Promise<UserEntity | undefined> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new HttpException(
          "L'utilisateur est introuvable",
          HttpStatus.NOT_FOUND
        );
      }

      return user;
    } catch (error) {
      throw new HttpException(
        ` ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
