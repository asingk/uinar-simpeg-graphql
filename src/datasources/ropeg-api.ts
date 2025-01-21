import axios from "axios";
import { RESTDataSource } from "@apollo/datasource-rest";
import {
    PekerjaanResponseModel,
    PendidikanResponseModel,
    ProfilPegawaiResponseModel
} from "../models/ropeg-api";

export class RopegApi extends RESTDataSource{

    override baseURL = 'https://api.kemenag.go.id/v1/'

    async createToken() {
        return axios.post(this.baseURL + 'auth/login', {
            email: process.env.ROPEG_EMAIL,
            password: process.env.ROPEG_PASSWORD,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    }

    async getProfilPegawai(token: string, nip: string) {
        return this.get<ProfilPegawaiResponseModel>(`pegawai/profil/${encodeURIComponent(nip)}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    async getPendidikan(token: string, nip: string) {
        return this.get<PendidikanResponseModel>(`pegawai/pendidikan/${encodeURIComponent(nip)}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    async getPekerjaan(token: string, nip: string) {
        return this.get<PekerjaanResponseModel>(`pegawai/pekerjaan/${encodeURIComponent(nip)}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
}
