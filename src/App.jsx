import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  Crown, Map, UserCog, ClipboardList, Target, Droplets, BookOpen, Trophy,
  Bell, Link2, Plus, Check, TrendingUp, Building2, Send, Info, Wrench, UserPlus, SlidersHorizontal, BarChart3, Gift, Shuffle,
} from "lucide-react";
import { load, persist } from "./storage.js";

/* === Dados reais importados do ACMS (período 1/2026–6/2026) === */
const SEED = {"regioes":[{"id":"r1","nome":"Região I - Caruaru","departamental":"Gerson Barbosa"},{"id":"r2","nome":"Região II - Gravatá","departamental":"Yure Kennyde"},{"id":"r3","nome":"Região III - Santa Cruz","departamental":"Adean Queiroz"},{"id":"r4","nome":"Região IV - Garanhuns","departamental":"Wellington Oliveira"},{"id":"r5","nome":"Região V - Arcoverde","departamental":"Ernando"},{"id":"r6","nome":"Região VI - Salgueiro","departamental":"José Vinicius"},{"id":"r7","nome":"Região VII - Petrolina","departamental":"Suevanio Vieira"}],"distritos":[{"id":"d2","nome":"Bela Vista","regiaoId":"r1","metaBatismo":70,"metaEstudo":200,"pastor":"Givaldo Candido Da Silva"},{"id":"d3","nome":"Caruaru","regiaoId":"r1","metaBatismo":50,"metaEstudo":200,"pastor":"Paulo Sergio Roberto De Sousa"},{"id":"d4","nome":"Jardim Centenário","regiaoId":"r1","metaBatismo":80,"metaEstudo":200,"pastor":"Jose Alberto De Oliveira Silva"},{"id":"d5","nome":"Jardim Panorama","regiaoId":"r1","metaBatismo":60,"metaEstudo":200,"pastor":"Jose Wellington Marques da Silva"},{"id":"d6","nome":"Passira","regiaoId":"r1","metaBatismo":60,"metaEstudo":200,"pastor":"Sandro Ferreira da Silva"},{"id":"d7","nome":"Salgado","regiaoId":"r1","metaBatismo":70,"metaEstudo":200,"pastor":"Francisco Anderson Fonseca Lira"},{"id":"d8","nome":"São Francisco","regiaoId":"r1","metaBatismo":60,"metaEstudo":200,"pastor":"Israel Messias Rodrigues"},{"id":"d9","nome":"Vassoural","regiaoId":"r1","metaBatismo":60,"metaEstudo":200,"pastor":"Fernando Nascimento da Silva"},{"id":"d10","nome":"Vila Kennedy","regiaoId":"r1","metaBatismo":80,"metaEstudo":200,"pastor":"Eliézer Monteiro Da Silva"},{"id":"d11","nome":"Belem de Maria","regiaoId":"r2","metaBatismo":50,"metaEstudo":200,"pastor":"Jeremias Israel Martins de Santana"},{"id":"d12","nome":"Bezerros","regiaoId":"r2","metaBatismo":70,"metaEstudo":200,"pastor":"Eduardo dos Reis Goncalves"},{"id":"d13","nome":"Bonito","regiaoId":"r2","metaBatismo":60,"metaEstudo":200,"pastor":"Rafael De Almeida Mestre"},{"id":"d14","nome":"Catende","regiaoId":"r2","metaBatismo":100,"metaEstudo":200,"pastor":"Eliezer Oliveira Salomao"},{"id":"d15","nome":"Chã Grande","regiaoId":"r2","metaBatismo":50,"metaEstudo":200,"pastor":"Jose Nivaldo Mendes Lira"},{"id":"d16","nome":"Cupira","regiaoId":"r2","metaBatismo":90,"metaEstudo":200,"pastor":"Jonathan Rodrigues da Rocha"},{"id":"d17","nome":"Gravata","regiaoId":"r2","metaBatismo":50,"metaEstudo":200,"pastor":"Bruno Cesar Pereira Frutuoso"},{"id":"d18","nome":"Iape","regiaoId":"r2","metaBatismo":10,"metaEstudo":200,"pastor":"Gutemberg Ferreira Alencar"},{"id":"d19","nome":"Lagoa dos Gatos","regiaoId":"r2","metaBatismo":50,"metaEstudo":200,"pastor":"Claudemilson Dos Santos De Moura"},{"id":"d20","nome":"Novo Horizonte","regiaoId":"r2","metaBatismo":70,"metaEstudo":200,"pastor":"Agnaldo Pereira Santos"},{"id":"d21","nome":"Santa Cruz","regiaoId":"r3","metaBatismo":70,"metaEstudo":200,"pastor":"Luiz Augusto Oliveira Arruda"},{"id":"d22","nome":"Sao Jorge","regiaoId":"r3","metaBatismo":70,"metaEstudo":200,"pastor":"Alvaro Nogueira Damasceno"},{"id":"d23","nome":"Surubim","regiaoId":"r3","metaBatismo":80,"metaEstudo":200,"pastor":"Jurandir Carvalho Dos Santos"},{"id":"d24","nome":"Toritama","regiaoId":"r3","metaBatismo":80,"metaEstudo":200,"pastor":"Josuedson Keyvison Silva e Silva"},{"id":"d25","nome":"Aguas Belas","regiaoId":"r4","metaBatismo":60,"metaEstudo":200,"pastor":"Alvaro Adauto Dos Santos Junior"},{"id":"d26","nome":"Boa Vista","regiaoId":"r4","metaBatismo":80,"metaEstudo":200,"pastor":"Richardson Benedito De Souza"},{"id":"d27","nome":"Garanhuns","regiaoId":"r4","metaBatismo":60,"metaEstudo":200,"pastor":"Wallace Pereira Lopes"},{"id":"d28","nome":"Lajedo","regiaoId":"r4","metaBatismo":60,"metaEstudo":200,"pastor":"Fabiano dos Santos Silva"},{"id":"d29","nome":"Magano","regiaoId":"r4","metaBatismo":70,"metaEstudo":200,"pastor":"Marcos Rogerio Andrade Do Nascimento"},{"id":"d30","nome":"Afogados da Ingazeira","regiaoId":"r5","metaBatismo":80,"metaEstudo":200,"pastor":"Gleikson Natã Mateus de Oliveira"},{"id":"d31","nome":"Arcoverde","regiaoId":"r5","metaBatismo":100,"metaEstudo":200,"pastor":"Gustavo Henrique Da Rocha Alves"},{"id":"d32","nome":"Belo Jardim","regiaoId":"r5","metaBatismo":80,"metaEstudo":200,"pastor":"Jefferson Alem Maurício da Silva"},{"id":"d33","nome":"Cohab I - Belo Jardim","regiaoId":"r5","metaBatismo":80,"metaEstudo":200,"pastor":"David Barros Alvares De Almeida"},{"id":"d34","nome":"Pesqueira","regiaoId":"r5","metaBatismo":80,"metaEstudo":200,"pastor":"Lucas Mancilha Gondim"},{"id":"d35","nome":"Sanharó","regiaoId":"r5","metaBatismo":50,"metaEstudo":200,"pastor":"David Santana da Silva Souza"},{"id":"d36","nome":"Araripina","regiaoId":"r6","metaBatismo":70,"metaEstudo":200,"pastor":"Eder Gabriel Marques Da Silva"},{"id":"d37","nome":"Bodocó","regiaoId":"r6","metaBatismo":70,"metaEstudo":200,"pastor":"Francisco Fabricio da Silva"},{"id":"d38","nome":"Cabrobo","regiaoId":"r6","metaBatismo":100,"metaEstudo":200,"pastor":"Diogo Luiz dos Santos Souza"},{"id":"d39","nome":"Floresta","regiaoId":"r6","metaBatismo":80,"metaEstudo":200,"pastor":"Yago Marciao Galvao"},{"id":"d40","nome":"Ouricuri","regiaoId":"r6","metaBatismo":90,"metaEstudo":200,"pastor":"Edson Oliveira Da Silva"},{"id":"d41","nome":"Petrolandia","regiaoId":"r6","metaBatismo":90,"metaEstudo":200,"pastor":"Edmilson Gonçalves Felipe"},{"id":"d42","nome":"Salgueiro","regiaoId":"r6","metaBatismo":70,"metaEstudo":200,"pastor":"Ravy Feitoza Basilio Da Silva"},{"id":"d43","nome":"Serra Talhada","regiaoId":"r6","metaBatismo":80,"metaEstudo":200,"pastor":"Pedro Antonio Leandro Bezerra"},{"id":"d44","nome":"Alto da Boa Vista","regiaoId":"r7","metaBatismo":80,"metaEstudo":200,"pastor":"Ronaldo Cirilo Santana"},{"id":"d45","nome":"Dormentes","regiaoId":"r7","metaBatismo":50,"metaEstudo":200,"pastor":"Mateus Wendel Bezerra Campelo"},{"id":"d46","nome":"Jose e Maria","regiaoId":"r7","metaBatismo":90,"metaEstudo":200,"pastor":"Selemias Castro Dos Santos"},{"id":"d47","nome":"Lagoa Grande","regiaoId":"r7","metaBatismo":90,"metaEstudo":200,"pastor":"Alex Ramos Dos Santos"},{"id":"d48","nome":"Maria Auxiliadora","regiaoId":"r7","metaBatismo":70,"metaEstudo":200,"pastor":"Adonias Guimarães Matos"},{"id":"d49","nome":"Ouro Preto","regiaoId":"r7","metaBatismo":100,"metaEstudo":200,"pastor":"Olivaldo Silvestre Da Silva"},{"id":"d50","nome":"Petrolina","regiaoId":"r7","metaBatismo":70,"metaEstudo":200,"pastor":"Emerson Alves Dias"},{"id":"d51","nome":"Rio Corrente","regiaoId":"r7","metaBatismo":80,"metaEstudo":200,"pastor":"Alexsandro Espindola De Siqueira"},{"id":"d52","nome":"Vila Eduardo","regiaoId":"r7","metaBatismo":100,"metaEstudo":200,"pastor":"Wender de Carvalho Seixas"}],"igrejas":[{"id":"ig1","nome":"Adalgisa","distritoId":"d8","tipo":"grupo"},{"id":"ig2","nome":"Afogados da Ingazeira","distritoId":"d30","tipo":"igreja"},{"id":"ig3","nome":"Afrânio","distritoId":"d45","tipo":"grupo"},{"id":"ig4","nome":"Agamenon Magalhães","distritoId":"d8","tipo":"igreja"},{"id":"ig5","nome":"Agrestina","distritoId":"d16","tipo":"igreja"},{"id":"ig6","nome":"Agrovila 46","distritoId":"d38","tipo":"igreja"},{"id":"ig7","nome":"Águas Belas","distritoId":"d25","tipo":"igreja"},{"id":"ig8","nome":"Alagoinha","distritoId":"d34","tipo":"grupo"},{"id":"ig9","nome":"Aldeia Mulungu - Salgueiro","distritoId":"d42","tipo":"grupo"},{"id":"ig10","nome":"Aldeia Quixaba","distritoId":"d39","tipo":"grupo"},{"id":"ig11","nome":"Aliança - Boa Vista","distritoId":"d26","tipo":"grupo"},{"id":"ig12","nome":"Altinho","distritoId":"d16","tipo":"grupo"},{"id":"ig13","nome":"Alto Boa Vista - Passira","distritoId":"d6","tipo":"grupo"},{"id":"ig14","nome":"Alto da Boa Vista","distritoId":"d44","tipo":"igreja"},{"id":"ig15","nome":"Alto da Boa Vista - Araripina","distritoId":"d36","tipo":"grupo"},{"id":"ig16","nome":"Alto da Boa Vista - Lagoa Grande","distritoId":"d47","tipo":"igreja"},{"id":"ig17","nome":"Alto da Esperança","distritoId":"d6","tipo":"igreja"},{"id":"ig18","nome":"Alto do Bom Jesus","distritoId":"d43","tipo":"igreja"},{"id":"ig19","nome":"Alto do Cocar","distritoId":"d44","tipo":"igreja"},{"id":"ig20","nome":"Alto do Jiquiri","distritoId":"d6","tipo":"igreja"},{"id":"ig21","nome":"Alto do Meio","distritoId":"d16","tipo":"grupo"},{"id":"ig22","nome":"Alto do Moura","distritoId":"d10","tipo":"grupo"},{"id":"ig23","nome":"Alto do Vento","distritoId":"d29","tipo":"igreja"},{"id":"ig24","nome":"Amaraji","distritoId":"d15","tipo":"grupo"},{"id":"ig25","nome":"Amaraji 2","distritoId":"d15","tipo":"grupo"},{"id":"ig26","nome":"Amorinha - Chã Grande","distritoId":"d15","tipo":"grupo"},{"id":"ig27","nome":"Angelim","distritoId":"d29","tipo":"grupo"},{"id":"ig28","nome":"Angico Torto","distritoId":"d25","tipo":"grupo"},{"id":"ig29","nome":"Antão","distritoId":"d24","tipo":"grupo"},{"id":"ig30","nome":"Antônio Cassimiro","distritoId":"d48","tipo":"igreja"},{"id":"ig31","nome":"Antônio Conselheiro","distritoId":"d41","tipo":"grupo"},{"id":"ig32","nome":"Araçá","distritoId":"d32","tipo":"grupo"},{"id":"ig33","nome":"Araripina","distritoId":"d36","tipo":"igreja"},{"id":"ig34","nome":"Arcoverde","distritoId":"d31","tipo":"igreja"},{"id":"ig35","nome":"Areias dos Pedros","distritoId":"d42","tipo":"grupo"},{"id":"ig37","nome":"Atrás da Banca","distritoId":"d50","tipo":"grupo"},{"id":"ig38","nome":"Bairro da Compesa","distritoId":"d19","tipo":"igreja"},{"id":"ig39","nome":"Bairro da Gefil","distritoId":"d5","tipo":"igreja"},{"id":"ig40","nome":"Bairro Fátima - Ouricuri","distritoId":"d40","tipo":"igreja"},{"id":"ig41","nome":"Bairro Glória","distritoId":"d16","tipo":"igreja"},{"id":"ig42","nome":"Baixa Grande","distritoId":"d34","tipo":"igreja"},{"id":"ig43","nome":"Bambú","distritoId":"d8","tipo":"igreja"},{"id":"ig44","nome":"Bandeira","distritoId":"d21","tipo":"grupo"},{"id":"ig45","nome":"Barra de Guabiraba","distritoId":"d13","tipo":"igreja"},{"id":"ig46","nome":"Barrinha","distritoId":"d21","tipo":"grupo"},{"id":"ig47","nome":"Barro Branco","distritoId":"d11","tipo":"grupo"},{"id":"ig48","nome":"Batateiras","distritoId":"d14","tipo":"grupo"},{"id":"ig49","nome":"Bela Vista","distritoId":"d27","tipo":"igreja"},{"id":"ig50","nome":"Bela Vista - Bela Vista","distritoId":"d2","tipo":"igreja"},{"id":"ig51","nome":"Bela Vista/Salgado - Surubim","distritoId":"d23","tipo":"grupo"},{"id":"ig52","nome":"Belém de Maria","distritoId":"d11","tipo":"igreja"},{"id":"ig53","nome":"Belém do São Francisco","distritoId":"d39","tipo":"igreja"},{"id":"ig54","nome":"Belo Jardim","distritoId":"d32","tipo":"igreja"},{"id":"ig55","nome":"Bem-ti-vi","distritoId":"d13","tipo":"grupo"},{"id":"ig56","nome":"Bezerros","distritoId":"d12","tipo":"igreja"},{"id":"ig57","nome":"Boa Esperança - Arcoverde","distritoId":"d31","tipo":"grupo"},{"id":"ig58","nome":"Boa Sorte","distritoId":"d17","tipo":"grupo"},{"id":"ig59","nome":"Boa Vista - Arcoverde","distritoId":"d31","tipo":"igreja"},{"id":"ig60","nome":"Boa Vista - Boa Vista","distritoId":"d26","tipo":"igreja"},{"id":"ig61","nome":"Boa Vista - Salgado","distritoId":"d7","tipo":"igreja"},{"id":"ig62","nome":"Boa Vista 1","distritoId":"d10","tipo":"igreja"},{"id":"ig63","nome":"Bodocó","distritoId":"d37","tipo":"igreja"},{"id":"ig64","nome":"Boi Manso","distritoId":"d33","tipo":"grupo"},{"id":"ig65","nome":"Bom Conselho - Belo Jardim","distritoId":"d32","tipo":"igreja"},{"id":"ig66","nome":"Bom Conselho - Boa Vista","distritoId":"d26","tipo":"igreja"},{"id":"ig67","nome":"Bom Jardim","distritoId":"d23","tipo":"grupo"},{"id":"ig68","nome":"Bonito","distritoId":"d13","tipo":"igreja"},{"id":"ig69","nome":"Brejão - Boa Vista","distritoId":"d26","tipo":"grupo"},{"id":"ig70","nome":"Brejão - Catende","distritoId":"d14","tipo":"grupo"},{"id":"ig71","nome":"Brejinho","distritoId":"d30","tipo":"grupo"},{"id":"ig72","nome":"Brejinho de Lagoa dos Gatos","distritoId":"d19","tipo":"grupo"},{"id":"ig73","nome":"Brejo da Madre de Deus","distritoId":"d24","tipo":"igreja"},{"id":"ig74","nome":"Buíque","distritoId":"d31","tipo":"igreja"},{"id":"ig75","nome":"C-03","distritoId":"d46","tipo":"grupo"},{"id":"ig76","nome":"Caatinguinha","distritoId":"d38","tipo":"grupo"},{"id":"ig77","nome":"Cabaceira","distritoId":"d45","tipo":"igreja"},{"id":"ig78","nome":"Cabaceiras - Canhotinho","distritoId":"d29","tipo":"grupo"},{"id":"ig79","nome":"Cabanas","distritoId":"d28","tipo":"grupo"},{"id":"ig80","nome":"Cabrobó","distritoId":"d38","tipo":"igreja"},{"id":"ig81","nome":"Cabugá - Jardim Centenário","distritoId":"d4","tipo":"grupo"},{"id":"ig82","nome":"Cachoeira Grande","distritoId":"d28","tipo":"grupo"},{"id":"ig83","nome":"Cachoeirinha","distritoId":"d28","tipo":"grupo"},{"id":"ig84","nome":"Cacimba Nova","distritoId":"d36","tipo":"igreja"},{"id":"ig85","nome":"Caetés","distritoId":"d27","tipo":"grupo"},{"id":"ig86","nome":"Caiucá","distritoId":"d10","tipo":"igreja"},{"id":"ig87","nome":"Caixa D'água","distritoId":"d16","tipo":"grupo"},{"id":"ig88","nome":"Calçado","distritoId":"d28","tipo":"grupo"},{"id":"ig89","nome":"Caldeirãozinho","distritoId":"d40","tipo":"grupo"},{"id":"ig90","nome":"Calumbi","distritoId":"d43","tipo":"grupo"},{"id":"ig91","nome":"Camocim de São Félix","distritoId":"d13","tipo":"igreja"},{"id":"ig92","nome":"Campo Santo","distritoId":"d45","tipo":"grupo"},{"id":"ig93","nome":"Canaã","distritoId":"d24","tipo":"grupo"},{"id":"ig94","nome":"Canaã - Catende","distritoId":"d14","tipo":"grupo"},{"id":"ig95","nome":"Candeais","distritoId":"d6","tipo":"igreja"},{"id":"ig96","nome":"Canhotinho","distritoId":"d29","tipo":"igreja"},{"id":"ig97","nome":"Canta Galo","distritoId":"d37","tipo":"grupo"},{"id":"ig98","nome":"Capela - Ouricuri","distritoId":"d40","tipo":"igreja"},{"id":"ig99","nome":"Capim - Jardim Panorama","distritoId":"d5","tipo":"igreja"},{"id":"ig100","nome":"Capoeiras","distritoId":"d27","tipo":"grupo"},{"id":"ig101","nome":"Caraíbas Agrovila 2","distritoId":"d38","tipo":"igreja"},{"id":"ig102","nome":"Caraíbas Agrovila XII","distritoId":"d38","tipo":"grupo"},{"id":"ig103","nome":"Caranguejo","distritoId":"d13","tipo":"grupo"},{"id":"ig104","nome":"Carnaíba","distritoId":"d30","tipo":"grupo"},{"id":"ig105","nome":"Carnaubeira","distritoId":"d39","tipo":"igreja"},{"id":"ig106","nome":"Caruaru","distritoId":"d3","tipo":"igreja"},{"id":"ig107","nome":"Casinhas","distritoId":"d40","tipo":"igreja"},{"id":"ig108","nome":"Catalunha","distritoId":"d47","tipo":"grupo"},{"id":"ig109","nome":"Catende","distritoId":"d14","tipo":"igreja"},{"id":"ig110","nome":"Catimbau","distritoId":"d31","tipo":"grupo"},{"id":"ig111","nome":"Cedro","distritoId":"d42","tipo":"grupo"},{"id":"ig112","nome":"Centenário","distritoId":"d34","tipo":"igreja"},{"id":"ig113","nome":"Central de Tabira","distritoId":"d30","tipo":"igreja"},{"id":"ig114","nome":"Chã das Panelas","distritoId":"d19","tipo":"grupo"},{"id":"ig115","nome":"Chã Grande","distritoId":"d15","tipo":"igreja"},{"id":"ig116","nome":"Chã Grande II","distritoId":"d15","tipo":"igreja"},{"id":"ig117","nome":"Cidade Jardim","distritoId":"d7","tipo":"igreja"},{"id":"ig118","nome":"Cinquentenário","distritoId":"d33","tipo":"igreja"},{"id":"ig119","nome":"Cohab - Belem de Maria","distritoId":"d11","tipo":"igreja"},{"id":"ig120","nome":"Cohab - Bezerros","distritoId":"d12","tipo":"igreja"},{"id":"ig121","nome":"Cohab - Toritama","distritoId":"d24","tipo":"igreja"},{"id":"ig122","nome":"Cohab 1 - Magano","distritoId":"d29","tipo":"igreja"},{"id":"ig123","nome":"Cohab Belém de São Francisco","distritoId":"d39","tipo":"grupo"},{"id":"ig124","nome":"Cohab de Agrestina","distritoId":"d16","tipo":"grupo"},{"id":"ig125","nome":"Cohab de Serra Talhada","distritoId":"d43","tipo":"igreja"},{"id":"ig126","nome":"Cohab I - Belo Jardim","distritoId":"d33","tipo":"igreja"},{"id":"ig127","nome":"Cohab I - Gravatá","distritoId":"d17","tipo":"igreja"},{"id":"ig128","nome":"Cohab I- Arcoverde","distritoId":"d31","tipo":"grupo"},{"id":"ig129","nome":"Cohab II - Boa Vista","distritoId":"d26","tipo":"igreja"},{"id":"ig130","nome":"Cohab II - Cohab I Belo Jd.","distritoId":"d33","tipo":"igreja"},{"id":"ig131","nome":"Colibri - Boa Vista","distritoId":"d26","tipo":"grupo"},{"id":"ig132","nome":"Colônia","distritoId":"d28","tipo":"grupo"},{"id":"ig133","nome":"Colônia - Bonito","distritoId":"d13","tipo":"grupo"},{"id":"ig134","nome":"Coqueiral","distritoId":"d24","tipo":"grupo"},{"id":"ig135","nome":"Correntes","distritoId":"d26","tipo":"igreja"},{"id":"ig136","nome":"Cosme e Damiao - Alto da Boa Vista","distritoId":"d44","tipo":"igreja"},{"id":"ig137","nome":"Cruz de Salinas","distritoId":"d46","tipo":"grupo"},{"id":"ig138","nome":"Cruzeiro - Bezerros","distritoId":"d12","tipo":"grupo"},{"id":"ig139","nome":"Cruzeiro - Gravatá","distritoId":"d17","tipo":"igreja"},{"id":"ig140","nome":"Cruzes","distritoId":"d20","tipo":"grupo"},{"id":"ig141","nome":"Cumaru","distritoId":"d6","tipo":"igreja"},{"id":"ig142","nome":"Cupira","distritoId":"d16","tipo":"igreja"},{"id":"ig143","nome":"Curitiba","distritoId":"d45","tipo":"grupo"},{"id":"ig144","nome":"Custódia","distritoId":"d30","tipo":"igreja"},{"id":"ig145","nome":"Delmario Braga","distritoId":"d28","tipo":"igreja"},{"id":"ig146","nome":"Deus É Fiel","distritoId":"d24","tipo":"grupo"},{"id":"ig147","nome":"Divino","distritoId":"d42","tipo":"grupo"},{"id":"ig148","nome":"Divinópolis","distritoId":"d3","tipo":"igreja"},{"id":"ig149","nome":"Dom Avelar","distritoId":"d46","tipo":"igreja"},{"id":"ig150","nome":"Dom Malan","distritoId":"d48","tipo":"igreja"},{"id":"ig151","nome":"Dona Lica","distritoId":"d22","tipo":"grupo"},{"id":"ig152","nome":"Dormentes","distritoId":"d45","tipo":"igreja"},{"id":"ig153","nome":"Duas Barras","distritoId":"d11","tipo":"grupo"},{"id":"ig154","nome":"Ebenézer","distritoId":"d26","tipo":"grupo"},{"id":"ig155","nome":"Elisa Holanda","distritoId":"d29","tipo":"igreja"},{"id":"ig156","nome":"Engenho Lajedo","distritoId":"d14","tipo":"grupo"},{"id":"ig157","nome":"Engenho Manaus","distritoId":"d14","tipo":"grupo"},{"id":"ig158","nome":"Engenho São João","distritoId":"d11","tipo":"igreja"},{"id":"ig159","nome":"Entroncamento","distritoId":"d14","tipo":"grupo"},{"id":"ig160","nome":"Entroncamento - Lagoa dos Gatos","distritoId":"d19","tipo":"grupo"},{"id":"ig161","nome":"Escola de Profetas","distritoId":"d12","tipo":"igreja"},{"id":"ig162","nome":"Estreito","distritoId":"d42","tipo":"grupo"},{"id":"ig163","nome":"Eucalipto","distritoId":"d34","tipo":"igreja"},{"id":"ig164","nome":"Euno Andrade","distritoId":"d32","tipo":"grupo"},{"id":"ig165","nome":"Extrema","distritoId":"d45","tipo":"grupo"},{"id":"ig166","nome":"Exu","distritoId":"d37","tipo":"grupo"},{"id":"ig167","nome":"Fazenda Bodes","distritoId":"d40","tipo":"grupo"},{"id":"ig168","nome":"Fazenda Cruz","distritoId":"d40","tipo":"grupo"},{"id":"ig169","nome":"Fazenda Gravatá","distritoId":"d39","tipo":"grupo"},{"id":"ig170","nome":"Fazenda Nova","distritoId":"d24","tipo":"grupo"},{"id":"ig171","nome":"Fernando Idalino Bezerra","distritoId":"d50","tipo":"igreja"},{"id":"ig172","nome":"Fertilidade","distritoId":"d13","tipo":"grupo"},{"id":"ig173","nome":"Flores","distritoId":"d30","tipo":"grupo"},{"id":"ig174","nome":"Floresta","distritoId":"d39","tipo":"igreja"},{"id":"ig175","nome":"Frei Damião","distritoId":"d33","tipo":"grupo"},{"id":"ig176","nome":"Frei Damião - Bonito","distritoId":"d13","tipo":"grupo"},{"id":"ig177","nome":"Frei Miguelinho","distritoId":"d23","tipo":"igreja"},{"id":"ig178","nome":"Gameleira","distritoId":"d33","tipo":"igreja"},{"id":"ig179","nome":"Garanhuns","distritoId":"d27","tipo":"igreja"},{"id":"ig180","nome":"Gercino Coelho","distritoId":"d46","tipo":"igreja"},{"id":"ig181","nome":"Gergelim","distritoId":"d36","tipo":"grupo"},{"id":"ig182","nome":"Granito","distritoId":"d37","tipo":"igreja"},{"id":"ig183","nome":"Gravatá","distritoId":"d17","tipo":"igreja"},{"id":"ig184","nome":"Gravata dos Gomes","distritoId":"d35","tipo":"grupo"},{"id":"ig185","nome":"Grupo Vale do Pajeú","distritoId":"d30","tipo":"grupo"},{"id":"ig186","nome":"Guabiraba - Belem de Maria","distritoId":"d11","tipo":"grupo"},{"id":"ig187","nome":"Guanumbi","distritoId":"d31","tipo":"igreja"},{"id":"ig188","nome":"Guaritas","distritoId":"d5","tipo":"grupo"},{"id":"ig189","nome":"Henrique Leite","distritoId":"d50","tipo":"igreja"},{"id":"ig190","nome":"Iape","distritoId":"d18","tipo":"igreja"},{"id":"ig191","nome":"Iati","distritoId":"d25","tipo":"igreja"},{"id":"ig192","nome":"Ibimirim","distritoId":"d31","tipo":"igreja"},{"id":"ig193","nome":"Ibirajuba","distritoId":"d16","tipo":"grupo"},{"id":"ig194","nome":"Ibó","distritoId":"d38","tipo":"grupo"},{"id":"ig195","nome":"Igreja Alto","distritoId":"d42","tipo":"grupo"},{"id":"ig196","nome":"Iguaracy","distritoId":"d30","tipo":"grupo"},{"id":"ig197","nome":"Ilha da Várzea","distritoId":"d38","tipo":"grupo"},{"id":"ig198","nome":"Ilha do Cajueiro","distritoId":"d38","tipo":"igreja"},{"id":"ig199","nome":"Ilha do Pontal","distritoId":"d47","tipo":"grupo"},{"id":"ig200","nome":"Inajá","distritoId":"d41","tipo":"grupo"},{"id":"ig201","nome":"Indianópolis","distritoId":"d3","tipo":"igreja"},{"id":"ig202","nome":"Ipanema","distritoId":"d34","tipo":"grupo"},{"id":"ig203","nome":"Ipsep","distritoId":"d38","tipo":"igreja"},{"id":"ig204","nome":"Ipubi","distritoId":"d36","tipo":"igreja"},{"id":"ig205","nome":"Itacuruba","distritoId":"d39","tipo":"grupo"},{"id":"ig206","nome":"Itaiba","distritoId":"d25","tipo":"igreja"},{"id":"ig207","nome":"Itaparica","distritoId":"d41","tipo":"grupo"},{"id":"ig208","nome":"Izacolândia","distritoId":"d47","tipo":"grupo"},{"id":"ig209","nome":"Jaçanã","distritoId":"d22","tipo":"grupo"},{"id":"ig210","nome":"Jaqueira - Catende","distritoId":"d14","tipo":"grupo"},{"id":"ig211","nome":"Jardim Amazonas","distritoId":"d49","tipo":"igreja"},{"id":"ig212","nome":"Jardim Centenário","distritoId":"d4","tipo":"igreja"},{"id":"ig213","nome":"Jardim do Éden","distritoId":"d6","tipo":"grupo"},{"id":"ig214","nome":"Jardim Guararapes","distritoId":"d51","tipo":"igreja"},{"id":"ig215","nome":"Jardim Panorama","distritoId":"d5","tipo":"igreja"},{"id":"ig216","nome":"Jardim Paraíso","distritoId":"d9","tipo":"igreja"},{"id":"ig217","nome":"Jardim Petrópolis","distritoId":"d51","tipo":"igreja"},{"id":"ig218","nome":"Jardim Primavera - Salgueiro","distritoId":"d42","tipo":"igreja"},{"id":"ig219","nome":"Jardim São Paulo","distritoId":"d49","tipo":"igreja"},{"id":"ig220","nome":"Jatauba","distritoId":"d22","tipo":"grupo"},{"id":"ig221","nome":"Jatoba - Ouricuri","distritoId":"d40","tipo":"grupo"},{"id":"ig222","nome":"Jatoba - Petrolândia","distritoId":"d41","tipo":"igreja"},{"id":"ig223","nome":"Jenipapo","distritoId":"d35","tipo":"grupo"},{"id":"ig224","nome":"João Alfredo","distritoId":"d23","tipo":"igreja"},{"id":"ig225","nome":"João de Deus I","distritoId":"d49","tipo":"igreja"},{"id":"ig226","nome":"João de Deus II","distritoId":"d49","tipo":"igreja"},{"id":"ig227","nome":"João de Deus III","distritoId":"d49","tipo":"igreja"},{"id":"ig228","nome":"João Mota","distritoId":"d4","tipo":"igreja"},{"id":"ig229","nome":"José Carlos de Oliveira","distritoId":"d10","tipo":"grupo"},{"id":"ig230","nome":"José e Maria","distritoId":"d46","tipo":"igreja"},{"id":"ig231","nome":"José Liberato","distritoId":"d9","tipo":"grupo"},{"id":"ig232","nome":"Juá","distritoId":"d9","tipo":"grupo"},{"id":"ig233","nome":"Jucati","distritoId":"d28","tipo":"grupo"},{"id":"ig234","nome":"Jupi","distritoId":"d28","tipo":"grupo"},{"id":"ig235","nome":"Jurema","distritoId":"d20","tipo":"grupo"},{"id":"ig236","nome":"Juriti","distritoId":"d5","tipo":"grupo"},{"id":"ig237","nome":"Km 25","distritoId":"d49","tipo":"igreja"},{"id":"ig238","nome":"Lagoa do Algodão","distritoId":"d2","tipo":"grupo"},{"id":"ig239","nome":"Lagoa do Felipe","distritoId":"d6","tipo":"grupo"},{"id":"ig240","nome":"Lagoa do Ouro","distritoId":"d26","tipo":"igreja"},{"id":"ig241","nome":"Lagoa do Souza","distritoId":"d19","tipo":"grupo"},{"id":"ig242","nome":"Lagoa dos Gatos","distritoId":"d19","tipo":"igreja"},{"id":"ig243","nome":"Lagoa dos Gatos Bairro","distritoId":"d19","tipo":"igreja"},{"id":"ig244","nome":"Lagoa Grande","distritoId":"d47","tipo":"igreja"},{"id":"ig245","nome":"Laje Grande - Catende","distritoId":"d14","tipo":"igreja"},{"id":"ig246","nome":"Laje Grande - Vila Anápolis","distritoId":"d34","tipo":"grupo"},{"id":"ig247","nome":"Lajedo","distritoId":"d28","tipo":"igreja"},{"id":"ig248","nome":"Liberdade","distritoId":"d27","tipo":"igreja"},{"id":"ig249","nome":"Livramento","distritoId":"d23","tipo":"grupo"},{"id":"ig250","nome":"Lopes","distritoId":"d40","tipo":"grupo"},{"id":"ig251","nome":"Lopes 2 Bodocó","distritoId":"d37","tipo":"grupo"},{"id":"ig252","nome":"Lot. Maria Cristina","distritoId":"d32","tipo":"grupo"},{"id":"ig253","nome":"Loteamento - Boa Vista","distritoId":"d26","tipo":"igreja"},{"id":"ig254","nome":"Loteamento Fernandes","distritoId":"d28","tipo":"grupo"},{"id":"ig255","nome":"Loteamento Recife","distritoId":"d52","tipo":"grupo"},{"id":"ig256","nome":"Luiz Bezerra Torres","distritoId":"d10","tipo":"grupo"},{"id":"ig257","nome":"Luiz Gonzaga","distritoId":"d2","tipo":"grupo"},{"id":"ig258","nome":"Madre Paulina","distritoId":"d47","tipo":"grupo"},{"id":"ig259","nome":"Magano","distritoId":"d29","tipo":"igreja"},{"id":"ig260","nome":"Majé Vila Anápolis","distritoId":"d34","tipo":"grupo"},{"id":"ig261","nome":"Malhada da Pedra","distritoId":"d2","tipo":"igreja"},{"id":"ig262","nome":"Malhada da Pedra- Dormentes","distritoId":"d45","tipo":"grupo"},{"id":"ig263","nome":"Malhada do Meio","distritoId":"d21","tipo":"igreja"},{"id":"ig264","nome":"Manari","distritoId":"d25","tipo":"grupo"},{"id":"ig265","nome":"Mandacaru","distritoId":"d46","tipo":"igreja"},{"id":"ig266","nome":"Manoel Ferreira","distritoId":"d25","tipo":"igreja"},{"id":"ig267","nome":"Maraial","distritoId":"d14","tipo":"grupo"},{"id":"ig268","nome":"Maria Auxiliadora - Petrolina","distritoId":"d48","tipo":"igreja"},{"id":"ig269","nome":"Maria Auxiliadora- Vila Kennedy","distritoId":"d10","tipo":"igreja"},{"id":"ig270","nome":"Maria Gorete","distritoId":"d47","tipo":"grupo"},{"id":"ig271","nome":"Maria Luiza","distritoId":"d38","tipo":"grupo"},{"id":"ig272","nome":"Maria Tereza","distritoId":"d20","tipo":"igreja"},{"id":"ig273","nome":"Massaranduba","distritoId":"d29","tipo":"igreja"},{"id":"ig274","nome":"Mimoso de Cima","distritoId":"d35","tipo":"igreja"},{"id":"ig275","nome":"Mimoso Seco","distritoId":"d35","tipo":"igreja"},{"id":"ig276","nome":"Mirandiba","distritoId":"d39","tipo":"grupo"},{"id":"ig277","nome":"Monsenhor Bernardino","distritoId":"d52","tipo":"igreja"},{"id":"ig278","nome":"Monte Alegre","distritoId":"d14","tipo":"grupo"},{"id":"ig279","nome":"Monte Carmelo","distritoId":"d2","tipo":"igreja"},{"id":"ig280","nome":"Monte Sinai - Magano","distritoId":"d29","tipo":"igreja"},{"id":"ig281","nome":"Monte Sinai - Vassoural","distritoId":"d9","tipo":"igreja"},{"id":"ig282","nome":"Morada da Serra","distritoId":"d35","tipo":"igreja"},{"id":"ig283","nome":"Moreilândia","distritoId":"d37","tipo":"grupo"},{"id":"ig284","nome":"Mulungu","distritoId":"d35","tipo":"grupo"},{"id":"ig285","nome":"Neco Aragão","distritoId":"d22","tipo":"igreja"},{"id":"ig286","nome":"Negras","distritoId":"d25","tipo":"grupo"},{"id":"ig287","nome":"Neves","distritoId":"d28","tipo":"igreja"},{"id":"ig288","nome":"Nova Descoberta","distritoId":"d47","tipo":"igreja"},{"id":"ig289","nome":"Nova Esperança","distritoId":"d6","tipo":"grupo"},{"id":"ig290","nome":"Nova Esperança - Bonito","distritoId":"d13","tipo":"igreja"},{"id":"ig291","nome":"Nova Esperança - Dormentes","distritoId":"d45","tipo":"grupo"},{"id":"ig292","nome":"Nova Esperança - Novo Horizonte","distritoId":"d20","tipo":"grupo"},{"id":"ig293","nome":"Nova Lage Grande","distritoId":"d14","tipo":"igreja"},{"id":"ig294","nome":"Nova Morada","distritoId":"d20","tipo":"igreja"},{"id":"ig295","nome":"Nova Petrolina","distritoId":"d51","tipo":"grupo"},{"id":"ig296","nome":"Novo Horizonte","distritoId":"d20","tipo":"igreja"},{"id":"ig297","nome":"Núcleo 01 Alto da Boa Vista","distritoId":"d44","tipo":"grupo"},{"id":"ig298","nome":"Núcleo 02","distritoId":"d44","tipo":"grupo"},{"id":"ig299","nome":"Núcleo 04","distritoId":"d44","tipo":"igreja"},{"id":"ig300","nome":"Núcleo 05","distritoId":"d44","tipo":"igreja"},{"id":"ig301","nome":"Núcleo 06","distritoId":"d49","tipo":"igreja"},{"id":"ig302","nome":"Núcleo 07","distritoId":"d46","tipo":"igreja"},{"id":"ig303","nome":"Núcleo 08","distritoId":"d52","tipo":"igreja"},{"id":"ig304","nome":"Núcleo 09","distritoId":"d48","tipo":"grupo"},{"id":"ig305","nome":"Núcleo 10","distritoId":"d52","tipo":"igreja"},{"id":"ig306","nome":"Núcleo 11","distritoId":"d52","tipo":"grupo"},{"id":"ig307","nome":"Olho D' Água","distritoId":"d41","tipo":"grupo"},{"id":"ig308","nome":"Olho D'aguinha","distritoId":"d39","tipo":"grupo"},{"id":"ig309","nome":"Orobó","distritoId":"d23","tipo":"grupo"},{"id":"ig310","nome":"Orocó","distritoId":"d38","tipo":"grupo"},{"id":"ig311","nome":"Oscarzão","distritoId":"d21","tipo":"grupo"},{"id":"ig312","nome":"Ouricuri","distritoId":"d40","tipo":"igreja"},{"id":"ig313","nome":"Ouro Preto","distritoId":"d49","tipo":"igreja"},{"id":"ig314","nome":"Ouro Verde","distritoId":"d47","tipo":"grupo"},{"id":"ig315","nome":"Ousadia","distritoId":"d14","tipo":"grupo"},{"id":"ig316","nome":"Palestina","distritoId":"d22","tipo":"grupo"},{"id":"ig317","nome":"Palmerina","distritoId":"d29","tipo":"grupo"},{"id":"ig318","nome":"Panelas","distritoId":"d20","tipo":"igreja"},{"id":"ig319","nome":"Pão de Açúcar","distritoId":"d21","tipo":"grupo"},{"id":"ig320","nome":"Paranatama","distritoId":"d27","tipo":"grupo"},{"id":"ig321","nome":"Parnamirim","distritoId":"d40","tipo":"grupo"},{"id":"ig322","nome":"Parque Residencial do Cajá","distritoId":"d10","tipo":"igreja"},{"id":"ig323","nome":"Passagem de Areia","distritoId":"d11","tipo":"grupo"},{"id":"ig324","nome":"Passira","distritoId":"d6","tipo":"igreja"},{"id":"ig325","nome":"Pau Ferro - Dormentes","distritoId":"d45","tipo":"grupo"},{"id":"ig326","nome":"Pau Santo","distritoId":"d8","tipo":"grupo"},{"id":"ig327","nome":"Pau Santo - Surubim","distritoId":"d23","tipo":"igreja"},{"id":"ig328","nome":"Pedra - Arcoverde","distritoId":"d31","tipo":"grupo"},{"id":"ig329","nome":"Pedra Linda","distritoId":"d48","tipo":"grupo"},{"id":"ig330","nome":"Pedrinhas","distritoId":"d47","tipo":"grupo"},{"id":"ig331","nome":"Peladas","distritoId":"d4","tipo":"igreja"},{"id":"ig332","nome":"Pesqueira","distritoId":"d34","tipo":"igreja"},{"id":"ig333","nome":"Petrolândia","distritoId":"d41","tipo":"igreja"},{"id":"ig334","nome":"Petrolina","distritoId":"d50","tipo":"igreja"},{"id":"ig335","nome":"Petrópolis - São Francisco","distritoId":"d8","tipo":"igreja"},{"id":"ig336","nome":"Pitanga","distritoId":"d34","tipo":"igreja"},{"id":"ig337","nome":"Pitombeira","distritoId":"d9","tipo":"igreja"},{"id":"ig338","nome":"Planalto","distritoId":"d28","tipo":"igreja"},{"id":"ig339","nome":"Planalto - Salgueiro","distritoId":"d42","tipo":"igreja"},{"id":"ig340","nome":"Poção","distritoId":"d35","tipo":"igreja"},{"id":"ig341","nome":"Poço Comprido","distritoId":"d26","tipo":"grupo"},{"id":"ig342","nome":"Poço da Cruz","distritoId":"d47","tipo":"grupo"},{"id":"ig343","nome":"Poço Fundo Santa Cruz","distritoId":"d21","tipo":"grupo"},{"id":"ig344","nome":"Polis Pacas","distritoId":"d22","tipo":"grupo"},{"id":"ig345","nome":"Ponta da Serra","distritoId":"d44","tipo":"grupo"},{"id":"ig346","nome":"Pontilhão","distritoId":"d33","tipo":"igreja"},{"id":"ig347","nome":"Popular Nova","distritoId":"d37","tipo":"grupo"},{"id":"ig348","nome":"Portal da Fé","distritoId":"d20","tipo":"igreja"},{"id":"ig349","nome":"Posto da Serra","distritoId":"d25","tipo":"igreja"},{"id":"ig350","nome":"Povoado Matias","distritoId":"d40","tipo":"grupo"},{"id":"ig351","nome":"Prado","distritoId":"d34","tipo":"igreja"},{"id":"ig352","nome":"Quadra 1","distritoId":"d41","tipo":"grupo"},{"id":"ig353","nome":"Quadra 17","distritoId":"d41","tipo":"igreja"},{"id":"ig354","nome":"Quanduz","distritoId":"d14","tipo":"grupo"},{"id":"ig355","nome":"Queimada de Jurema","distritoId":"d20","tipo":"igreja"},{"id":"ig356","nome":"Queimadas","distritoId":"d31","tipo":"grupo"},{"id":"ig357","nome":"Quipapá","distritoId":"d20","tipo":"igreja"},{"id":"ig358","nome":"Quitimbu - Afogados da Ingazeira","distritoId":"d30","tipo":"grupo"},{"id":"ig359","nome":"R4","distritoId":"d49","tipo":"grupo"},{"id":"ig360","nome":"Rafael","distritoId":"d5","tipo":"grupo"},{"id":"ig361","nome":"Rajada","distritoId":"d45","tipo":"igreja"},{"id":"ig362","nome":"Rajada II","distritoId":"d45","tipo":"igreja"},{"id":"ig363","nome":"Rancharia","distritoId":"d37","tipo":"grupo"},{"id":"ig364","nome":"Redenção","distritoId":"d30","tipo":"grupo"},{"id":"ig365","nome":"Rendeiras","distritoId":"d9","tipo":"igreja"},{"id":"ig366","nome":"Residencial Baixa Grande","distritoId":"d34","tipo":"grupo"},{"id":"ig367","nome":"Riachão - Catende","distritoId":"d14","tipo":"igreja"},{"id":"ig368","nome":"Riacho das Almas","distritoId":"d6","tipo":"igreja"},{"id":"ig369","nome":"Riacho de Tanque","distritoId":"d23","tipo":"grupo"},{"id":"ig370","nome":"Riacho Doce","distritoId":"d24","tipo":"grupo"},{"id":"ig371","nome":"Riacho Fundo","distritoId":"d35","tipo":"grupo"},{"id":"ig372","nome":"Rio Corrente","distritoId":"d51","tipo":"igreja"},{"id":"ig373","nome":"Roçadinho","distritoId":"d14","tipo":"grupo"},{"id":"ig374","nome":"Roçado","distritoId":"d51","tipo":"grupo"},{"id":"ig375","nome":"Safra","distritoId":"d47","tipo":"grupo"},{"id":"ig376","nome":"Sairé","distritoId":"d12","tipo":"grupo"},{"id":"ig377","nome":"Salgadinho","distritoId":"d6","tipo":"grupo"},{"id":"ig378","nome":"Salgado","distritoId":"d7","tipo":"igreja"},{"id":"ig379","nome":"Salgueiro","distritoId":"d42","tipo":"igreja"},{"id":"ig380","nome":"Saloá","distritoId":"d25","tipo":"igreja"},{"id":"ig381","nome":"Salobro","distritoId":"d34","tipo":"grupo"},{"id":"ig382","nome":"Sanharó","distritoId":"d35","tipo":"igreja"},{"id":"ig383","nome":"Sanharó II","distritoId":"d35","tipo":"igreja"},{"id":"ig384","nome":"Santa Cruz - Ouricuri","distritoId":"d40","tipo":"grupo"},{"id":"ig385","nome":"Santa Cruz da Baixa Verde","distritoId":"d43","tipo":"grupo"},{"id":"ig386","nome":"Santa Cruz do Capibaribe","distritoId":"d21","tipo":"igreja"},{"id":"ig387","nome":"Santa Luzia - José e Maria","distritoId":"d46","tipo":"igreja"},{"id":"ig388","nome":"Santa Maria - Ouricuri","distritoId":"d40","tipo":"igreja"},{"id":"ig389","nome":"Santa Maria da Boa Vista","distritoId":"d47","tipo":"igreja"},{"id":"ig390","nome":"Santa Maria do Cambucá","distritoId":"d23","tipo":"grupo"},{"id":"ig391","nome":"Santa Rosa","distritoId":"d9","tipo":"igreja"},{"id":"ig392","nome":"Santa Rosa - Belo Jardim","distritoId":"d32","tipo":"grupo"},{"id":"ig393","nome":"Santa Rosa - Floresta","distritoId":"d39","tipo":"igreja"},{"id":"ig394","nome":"Santa Terezinha","distritoId":"d30","tipo":"grupo"},{"id":"ig395","nome":"Santo Afonso","distritoId":"d33","tipo":"grupo"},{"id":"ig396","nome":"Santo Antônio","distritoId":"d33","tipo":"grupo"},{"id":"ig397","nome":"Santo Antônio - Bezerros","distritoId":"d12","tipo":"igreja"},{"id":"ig398","nome":"Santo Augustinho","distritoId":"d22","tipo":"grupo"},{"id":"ig399","nome":"São Benedito do Sul","distritoId":"d14","tipo":"grupo"},{"id":"ig400","nome":"São Bento do Una","distritoId":"d33","tipo":"igreja"},{"id":"ig401","nome":"São Caetano - Jd. Centenário","distritoId":"d4","tipo":"igreja"},{"id":"ig402","nome":"São Caetano Betânia - Serra Talhada","distritoId":"d43","tipo":"igreja"},{"id":"ig403","nome":"São Cristovão","distritoId":"d31","tipo":"igreja"},{"id":"ig404","nome":"São Domingos - Stª Cruz","distritoId":"d21","tipo":"igreja"},{"id":"ig405","nome":"São Francisco - Bodocó","distritoId":"d37","tipo":"igreja"},{"id":"ig406","nome":"São Francisco - São Francisco","distritoId":"d8","tipo":"igreja"},{"id":"ig407","nome":"São Francisco II - São Francisco","distritoId":"d8","tipo":"grupo"},{"id":"ig408","nome":"São Gonçalo","distritoId":"d51","tipo":"igreja"},{"id":"ig409","nome":"São João - Cupira","distritoId":"d16","tipo":"grupo"},{"id":"ig410","nome":"São João - Magano","distritoId":"d29","tipo":"igreja"},{"id":"ig411","nome":"São João da Escócia","distritoId":"d2","tipo":"igreja"},{"id":"ig412","nome":"São Joaquim - José e Maria","distritoId":"d46","tipo":"grupo"},{"id":"ig413","nome":"São Joaquim do Monte","distritoId":"d13","tipo":"igreja"},{"id":"ig414","nome":"São Jorge","distritoId":"d22","tipo":"igreja"},{"id":"ig415","nome":"São José","distritoId":"d31","tipo":"grupo"},{"id":"ig416","nome":"São José - Salgado","distritoId":"d7","tipo":"grupo"},{"id":"ig417","nome":"Sao Jose - Santa Cruz","distritoId":"d21","tipo":"grupo"},{"id":"ig418","nome":"São José - Surubim","distritoId":"d23","tipo":"grupo"},{"id":"ig419","nome":"São José - Toritama","distritoId":"d24","tipo":"grupo"},{"id":"ig420","nome":"São José do Belmonte","distritoId":"d43","tipo":"grupo"},{"id":"ig421","nome":"São José do Egito","distritoId":"d30","tipo":"grupo"},{"id":"ig422","nome":"São Miguel","distritoId":"d22","tipo":"igreja"},{"id":"ig423","nome":"São Pedro","distritoId":"d32","tipo":"igreja"},{"id":"ig424","nome":"São Sebastião","distritoId":"d23","tipo":"igreja"},{"id":"ig425","nome":"Saraiva","distritoId":"d36","tipo":"grupo"},{"id":"ig426","nome":"Satisfeito","distritoId":"d45","tipo":"grupo"},{"id":"ig427","nome":"Serra Branca","distritoId":"d36","tipo":"grupo"},{"id":"ig428","nome":"Serra da Cachoeira","distritoId":"d24","tipo":"grupo"},{"id":"ig429","nome":"Serra do Arapuá","distritoId":"d39","tipo":"grupo"},{"id":"ig430","nome":"Serra do Jacaré","distritoId":"d39","tipo":"igreja"},{"id":"ig431","nome":"Serra do Vento","distritoId":"d32","tipo":"igreja"},{"id":"ig432","nome":"Serra Grande","distritoId":"d17","tipo":"grupo"},{"id":"ig433","nome":"Serra Grande - Boa Vista","distritoId":"d26","tipo":"grupo"},{"id":"ig434","nome":"Serra Negra","distritoId":"d12","tipo":"grupo"},{"id":"ig435","nome":"Serra Nova","distritoId":"d2","tipo":"igreja"},{"id":"ig436","nome":"Serra Talhada","distritoId":"d43","tipo":"igreja"},{"id":"ig437","nome":"Serrita","distritoId":"d42","tipo":"igreja"},{"id":"ig438","nome":"Serrolândia","distritoId":"d36","tipo":"grupo"},{"id":"ig439","nome":"Serrote","distritoId":"d47","tipo":"grupo"},{"id":"ig440","nome":"Serrote do Urubu","distritoId":"d50","tipo":"igreja"},{"id":"ig441","nome":"Sertânia","distritoId":"d30","tipo":"grupo"},{"id":"ig442","nome":"Severino Afonso","distritoId":"d5","tipo":"igreja"},{"id":"ig443","nome":"Sipauba","distritoId":"d37","tipo":"grupo"},{"id":"ig444","nome":"Sítio Araras","distritoId":"d6","tipo":"grupo"},{"id":"ig445","nome":"Sítio Boa Vista","distritoId":"d10","tipo":"grupo"},{"id":"ig446","nome":"Sítio Bredos","distritoId":"d43","tipo":"grupo"},{"id":"ig447","nome":"Sítio Camará","distritoId":"d37","tipo":"grupo"},{"id":"ig448","nome":"Sítio Camarada","distritoId":"d6","tipo":"grupo"},{"id":"ig449","nome":"Sítio Canela","distritoId":"d25","tipo":"grupo"},{"id":"ig450","nome":"Sítio Capivara","distritoId":"d26","tipo":"grupo"},{"id":"ig451","nome":"Sítio Capoeira","distritoId":"d41","tipo":"grupo"},{"id":"ig452","nome":"Sítio Chicão","distritoId":"d6","tipo":"igreja"},{"id":"ig453","nome":"Sítio Cipó","distritoId":"d8","tipo":"grupo"},{"id":"ig454","nome":"Sítio do Meio","distritoId":"d11","tipo":"grupo"},{"id":"ig455","nome":"Sítio dos Nunes","distritoId":"d30","tipo":"grupo"},{"id":"ig456","nome":"Sítio Fazenda Nova","distritoId":"d29","tipo":"grupo"},{"id":"ig457","nome":"Sítio Gameleiro - Lajedo","distritoId":"d28","tipo":"grupo"},{"id":"ig458","nome":"Sítio Insurreição","distritoId":"d12","tipo":"igreja"},{"id":"ig459","nome":"Sítio Malhada do Juá - Serra Talhad","distritoId":"d43","tipo":"grupo"},{"id":"ig460","nome":"Sítio Mangueira","distritoId":"d15","tipo":"igreja"},{"id":"ig461","nome":"Sítio Mimosinho","distritoId":"d27","tipo":"igreja"},{"id":"ig462","nome":"Sítio Muricí","distritoId":"d8","tipo":"igreja"},{"id":"ig463","nome":"Sítio Queimadinha","distritoId":"d28","tipo":"igreja"},{"id":"ig464","nome":"Sítio Rodrigues","distritoId":"d25","tipo":"grupo"},{"id":"ig465","nome":"Sítio São João - Rio Corrente","distritoId":"d51","tipo":"grupo"},{"id":"ig466","nome":"Sítio Tambor","distritoId":"d6","tipo":"igreja"},{"id":"ig467","nome":"Sítio Varzinha","distritoId":"d37","tipo":"grupo"},{"id":"ig468","nome":"Socorro","distritoId":"d34","tipo":"grupo"},{"id":"ig469","nome":"Sol Poente","distritoId":"d10","tipo":"igreja"},{"id":"ig470","nome":"Sombra da Barra","distritoId":"d11","tipo":"grupo"},{"id":"ig471","nome":"Surubim","distritoId":"d23","tipo":"igreja"},{"id":"ig472","nome":"Tabira","distritoId":"d30","tipo":"igreja"},{"id":"ig473","nome":"Tabocas","distritoId":"d37","tipo":"grupo"},{"id":"ig474","nome":"Tabuleiro","distritoId":"d16","tipo":"grupo"},{"id":"ig475","nome":"Tacaimbó","distritoId":"d32","tipo":"grupo"},{"id":"ig476","nome":"Tambor","distritoId":"d19","tipo":"igreja"},{"id":"ig477","nome":"Tamboril - Salgueiro","distritoId":"d42","tipo":"grupo"},{"id":"ig478","nome":"Tamboril Ouricuri","distritoId":"d40","tipo":"igreja"},{"id":"ig479","nome":"Tapera","distritoId":"d51","tipo":"igreja"},{"id":"ig480","nome":"Taquaritinga do Norte","distritoId":"d22","tipo":"grupo"},{"id":"ig481","nome":"Tereza Mendonça","distritoId":"d32","tipo":"grupo"},{"id":"ig482","nome":"Terezinha","distritoId":"d26","tipo":"grupo"},{"id":"ig483","nome":"Terra Nova","distritoId":"d42","tipo":"igreja"},{"id":"ig484","nome":"Timorante","distritoId":"d37","tipo":"igreja"},{"id":"ig485","nome":"Toritama","distritoId":"d24","tipo":"igreja"},{"id":"ig486","nome":"Trindade","distritoId":"d36","tipo":"igreja"},{"id":"ig487","nome":"Triunfo","distritoId":"d43","tipo":"grupo"},{"id":"ig488","nome":"Trupé","distritoId":"d37","tipo":"grupo"},{"id":"ig489","nome":"Tupanatinga","distritoId":"d25","tipo":"grupo"},{"id":"ig490","nome":"Umari","distritoId":"d23","tipo":"grupo"},{"id":"ig491","nome":"Umbuzeiro","distritoId":"d16","tipo":"grupo"},{"id":"ig492","nome":"Universitário","distritoId":"d7","tipo":"grupo"},{"id":"ig493","nome":"Uruçu-mirim","distritoId":"d17","tipo":"grupo"},{"id":"ig494","nome":"Vale Grande Rio","distritoId":"d49","tipo":"igreja"},{"id":"ig495","nome":"Valentim Gravata","distritoId":"d17","tipo":"grupo"},{"id":"ig496","nome":"Varzinha","distritoId":"d43","tipo":"grupo"},{"id":"ig497","nome":"Vassoural","distritoId":"d9","tipo":"igreja"},{"id":"ig498","nome":"Veloso","distritoId":"d19","tipo":"grupo"},{"id":"ig499","nome":"Venturosa","distritoId":"d31","tipo":"grupo"},{"id":"ig500","nome":"Verdejantes","distritoId":"d42","tipo":"grupo"},{"id":"ig501","nome":"Vermelhos","distritoId":"d47","tipo":"igreja"},{"id":"ig502","nome":"Vertente do Lério","distritoId":"d23","tipo":"grupo"},{"id":"ig503","nome":"Vertentes","distritoId":"d24","tipo":"grupo"},{"id":"ig504","nome":"Vila Anápolis","distritoId":"d34","tipo":"igreja"},{"id":"ig505","nome":"Vila Andorinha","distritoId":"d10","tipo":"grupo"},{"id":"ig506","nome":"Vila Bela","distritoId":"d43","tipo":"grupo"},{"id":"ig507","nome":"Vila Campos","distritoId":"d4","tipo":"grupo"},{"id":"ig508","nome":"Vila Caruá","distritoId":"d42","tipo":"grupo"},{"id":"ig509","nome":"Vila do Aeroporto","distritoId":"d10","tipo":"grupo"},{"id":"ig510","nome":"Vila do Pará","distritoId":"d22","tipo":"grupo"},{"id":"ig511","nome":"Vila Eduardo","distritoId":"d52","tipo":"igreja"},{"id":"ig512","nome":"Vila Esperança","distritoId":"d48","tipo":"grupo"},{"id":"ig513","nome":"Vila Eulália","distritoId":"d48","tipo":"igreja"},{"id":"ig514","nome":"Vila Kennedy","distritoId":"d10","tipo":"igreja"},{"id":"ig515","nome":"Vila Malta","distritoId":"d41","tipo":"grupo"},{"id":"ig516","nome":"Vila Massangano","distritoId":"d51","tipo":"igreja"},{"id":"ig517","nome":"Vila Nova do N7","distritoId":"d46","tipo":"grupo"},{"id":"ig518","nome":"Vila Nova do N8","distritoId":"d52","tipo":"grupo"},{"id":"ig519","nome":"Vila Padre Inácio","distritoId":"d10","tipo":"igreja"},{"id":"ig520","nome":"Vila Raiz","distritoId":"d32","tipo":"grupo"},{"id":"ig521","nome":"Vila Santa Luzia","distritoId":"d15","tipo":"grupo"},{"id":"ig522","nome":"Vila Santo Antônio","distritoId":"d25","tipo":"grupo"},{"id":"ig523","nome":"Vila Serrania","distritoId":"d36","tipo":"grupo"},{"id":"ig524","nome":"Village","distritoId":"d29","tipo":"igreja"},{"id":"ig525","nome":"Vitória","distritoId":"d47","tipo":"grupo"},{"id":"ig526","nome":"Vivendas","distritoId":"d52","tipo":"grupo"},{"id":"ig527","nome":"Xique Xique","distritoId":"d5","tipo":"grupo"}],"batismos":[{"ig":"ig50","m":4,"bat":1,"reb":3,"pf":1},{"ig":"ig50","m":3,"bat":1,"reb":1,"pf":0},{"ig":"ig50","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig50","m":2,"bat":1,"reb":0,"pf":0},{"ig":"ig257","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig279","m":1,"bat":5,"reb":0,"pf":0},{"ig":"ig279","m":4,"bat":0,"reb":2,"pf":0},{"ig":"ig411","m":2,"bat":1,"reb":1,"pf":0},{"ig":"ig411","m":4,"bat":3,"reb":1,"pf":0},{"ig":"ig435","m":1,"bat":3,"reb":0,"pf":0},{"ig":"ig435","m":4,"bat":0,"reb":0,"pf":1},{"ig":"ig435","m":3,"bat":0,"reb":1,"pf":0},{"ig":"ig106","m":1,"bat":0,"reb":0,"pf":1},{"ig":"ig106","m":3,"bat":0,"reb":1,"pf":1},{"ig":"ig106","m":4,"bat":0,"reb":2,"pf":0},{"ig":"ig148","m":4,"bat":0,"reb":1,"pf":0},{"ig":"ig201","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig81","m":1,"bat":5,"reb":0,"pf":0},{"ig":"ig212","m":1,"bat":7,"reb":0,"pf":0},{"ig":"ig228","m":4,"bat":3,"reb":1,"pf":0},{"ig":"ig228","m":1,"bat":9,"reb":3,"pf":0},{"ig":"ig331","m":3,"bat":6,"reb":1,"pf":0},{"ig":"ig331","m":1,"bat":2,"reb":0,"pf":0},{"ig":"ig331","m":4,"bat":2,"reb":0,"pf":0},{"ig":"ig331","m":2,"bat":1,"reb":0,"pf":0},{"ig":"ig401","m":1,"bat":4,"reb":2,"pf":0},{"ig":"ig401","m":4,"bat":2,"reb":0,"pf":0},{"ig":"ig507","m":1,"bat":16,"reb":0,"pf":0},{"ig":"ig507","m":4,"bat":1,"reb":1,"pf":0},{"ig":"ig507","m":2,"bat":1,"reb":0,"pf":0},{"ig":"ig39","m":1,"bat":3,"reb":0,"pf":0},{"ig":"ig99","m":5,"bat":0,"reb":1,"pf":0},{"ig":"ig99","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig188","m":1,"bat":2,"reb":0,"pf":0},{"ig":"ig215","m":1,"bat":2,"reb":0,"pf":0},{"ig":"ig215","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig360","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig442","m":4,"bat":4,"reb":0,"pf":0},{"ig":"ig442","m":5,"bat":2,"reb":0,"pf":0},{"ig":"ig527","m":4,"bat":3,"reb":0,"pf":0},{"ig":"ig527","m":1,"bat":2,"reb":0,"pf":0},{"ig":"ig13","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig17","m":1,"bat":3,"reb":0,"pf":0},{"ig":"ig20","m":1,"bat":2,"reb":0,"pf":0},{"ig":"ig141","m":4,"bat":4,"reb":0,"pf":0},{"ig":"ig239","m":3,"bat":0,"reb":1,"pf":1},{"ig":"ig239","m":2,"bat":2,"reb":0,"pf":0},{"ig":"ig324","m":1,"bat":3,"reb":0,"pf":0},{"ig":"ig61","m":4,"bat":1,"reb":1,"pf":0},{"ig":"ig117","m":3,"bat":2,"reb":0,"pf":0},{"ig":"ig378","m":3,"bat":4,"reb":0,"pf":0},{"ig":"ig378","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig378","m":4,"bat":6,"reb":0,"pf":0},{"ig":"ig416","m":4,"bat":2,"reb":0,"pf":0},{"ig":"ig1","m":4,"bat":2,"reb":2,"pf":0},{"ig":"ig4","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig43","m":1,"bat":0,"reb":3,"pf":1},{"ig":"ig335","m":1,"bat":2,"reb":0,"pf":0},{"ig":"ig406","m":5,"bat":1,"reb":0,"pf":0},{"ig":"ig406","m":3,"bat":0,"reb":2,"pf":0},{"ig":"ig407","m":4,"bat":2,"reb":0,"pf":0},{"ig":"ig281","m":4,"bat":2,"reb":2,"pf":0},{"ig":"ig281","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig365","m":2,"bat":0,"reb":1,"pf":0},{"ig":"ig497","m":1,"bat":15,"reb":0,"pf":0},{"ig":"ig497","m":3,"bat":0,"reb":0,"pf":1},{"ig":"ig22","m":1,"bat":2,"reb":0,"pf":0},{"ig":"ig62","m":4,"bat":1,"reb":2,"pf":2},{"ig":"ig62","m":2,"bat":1,"reb":0,"pf":0},{"ig":"ig86","m":1,"bat":1,"reb":1,"pf":0},{"ig":"ig229","m":4,"bat":0,"reb":1,"pf":0},{"ig":"ig269","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig269","m":5,"bat":1,"reb":0,"pf":0},{"ig":"ig322","m":3,"bat":2,"reb":0,"pf":0},{"ig":"ig322","m":1,"bat":0,"reb":2,"pf":0},{"ig":"ig505","m":1,"bat":5,"reb":1,"pf":0},{"ig":"ig509","m":1,"bat":5,"reb":0,"pf":0},{"ig":"ig509","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig514","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig519","m":5,"bat":0,"reb":1,"pf":0},{"ig":"ig519","m":4,"bat":2,"reb":2,"pf":0},{"ig":"ig519","m":1,"bat":2,"reb":0,"pf":0},{"ig":"ig52","m":4,"bat":5,"reb":0,"pf":0},{"ig":"ig52","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig119","m":2,"bat":2,"reb":0,"pf":0},{"ig":"ig119","m":4,"bat":2,"reb":0,"pf":0},{"ig":"ig119","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig153","m":3,"bat":2,"reb":0,"pf":0},{"ig":"ig186","m":2,"bat":4,"reb":0,"pf":0},{"ig":"ig323","m":4,"bat":4,"reb":0,"pf":0},{"ig":"ig323","m":2,"bat":1,"reb":0,"pf":0},{"ig":"ig323","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig120","m":2,"bat":3,"reb":0,"pf":0},{"ig":"ig397","m":1,"bat":0,"reb":2,"pf":0},{"ig":"ig458","m":5,"bat":4,"reb":1,"pf":0},{"ig":"ig55","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig68","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig133","m":1,"bat":2,"reb":0,"pf":0},{"ig":"ig290","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig413","m":1,"bat":2,"reb":0,"pf":0},{"ig":"ig413","m":6,"bat":4,"reb":0,"pf":0},{"ig":"ig48","m":4,"bat":3,"reb":0,"pf":0},{"ig":"ig94","m":1,"bat":1,"reb":1,"pf":0},{"ig":"ig109","m":6,"bat":1,"reb":0,"pf":0},{"ig":"ig156","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig159","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig159","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig245","m":4,"bat":2,"reb":0,"pf":0},{"ig":"ig245","m":1,"bat":3,"reb":0,"pf":0},{"ig":"ig267","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig278","m":2,"bat":2,"reb":0,"pf":0},{"ig":"ig293","m":1,"bat":4,"reb":2,"pf":0},{"ig":"ig293","m":2,"bat":1,"reb":0,"pf":0},{"ig":"ig293","m":4,"bat":0,"reb":2,"pf":0},{"ig":"ig367","m":1,"bat":0,"reb":2,"pf":1},{"ig":"ig26","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig115","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig115","m":3,"bat":2,"reb":1,"pf":0},{"ig":"ig115","m":2,"bat":1,"reb":1,"pf":0},{"ig":"ig116","m":2,"bat":2,"reb":0,"pf":0},{"ig":"ig5","m":3,"bat":0,"reb":1,"pf":0},{"ig":"ig41","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig41","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig87","m":6,"bat":0,"reb":0,"pf":2},{"ig":"ig87","m":4,"bat":2,"reb":0,"pf":0},{"ig":"ig124","m":2,"bat":6,"reb":0,"pf":0},{"ig":"ig124","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig142","m":3,"bat":2,"reb":0,"pf":0},{"ig":"ig142","m":5,"bat":2,"reb":0,"pf":0},{"ig":"ig142","m":4,"bat":2,"reb":0,"pf":0},{"ig":"ig127","m":2,"bat":2,"reb":0,"pf":0},{"ig":"ig139","m":5,"bat":1,"reb":1,"pf":0},{"ig":"ig190","m":4,"bat":5,"reb":0,"pf":0},{"ig":"ig190","m":5,"bat":3,"reb":0,"pf":0},{"ig":"ig190","m":1,"bat":0,"reb":0,"pf":1},{"ig":"ig38","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig72","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig114","m":1,"bat":4,"reb":1,"pf":0},{"ig":"ig160","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig242","m":1,"bat":0,"reb":0,"pf":2},{"ig":"ig243","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig140","m":1,"bat":3,"reb":0,"pf":0},{"ig":"ig235","m":3,"bat":0,"reb":3,"pf":0},{"ig":"ig272","m":1,"bat":2,"reb":0,"pf":0},{"ig":"ig292","m":1,"bat":3,"reb":0,"pf":0},{"ig":"ig294","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig296","m":3,"bat":3,"reb":0,"pf":0},{"ig":"ig296","m":1,"bat":4,"reb":0,"pf":0},{"ig":"ig296","m":2,"bat":1,"reb":0,"pf":0},{"ig":"ig348","m":5,"bat":1,"reb":0,"pf":0},{"ig":"ig348","m":2,"bat":0,"reb":1,"pf":0},{"ig":"ig355","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig357","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig46","m":1,"bat":4,"reb":1,"pf":0},{"ig":"ig46","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig263","m":1,"bat":5,"reb":1,"pf":0},{"ig":"ig319","m":3,"bat":0,"reb":2,"pf":0},{"ig":"ig319","m":1,"bat":4,"reb":0,"pf":0},{"ig":"ig319","m":5,"bat":0,"reb":1,"pf":0},{"ig":"ig386","m":5,"bat":1,"reb":0,"pf":0},{"ig":"ig386","m":4,"bat":3,"reb":0,"pf":0},{"ig":"ig386","m":1,"bat":6,"reb":0,"pf":0},{"ig":"ig404","m":2,"bat":0,"reb":1,"pf":0},{"ig":"ig404","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig404","m":1,"bat":1,"reb":1,"pf":0},{"ig":"ig417","m":5,"bat":2,"reb":0,"pf":0},{"ig":"ig209","m":1,"bat":2,"reb":0,"pf":0},{"ig":"ig220","m":4,"bat":0,"reb":1,"pf":0},{"ig":"ig398","m":1,"bat":1,"reb":7,"pf":0},{"ig":"ig414","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig414","m":5,"bat":1,"reb":0,"pf":0},{"ig":"ig414","m":4,"bat":1,"reb":1,"pf":0},{"ig":"ig422","m":2,"bat":0,"reb":1,"pf":0},{"ig":"ig480","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig67","m":4,"bat":2,"reb":0,"pf":0},{"ig":"ig177","m":4,"bat":2,"reb":1,"pf":0},{"ig":"ig224","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig327","m":5,"bat":2,"reb":0,"pf":0},{"ig":"ig327","m":4,"bat":0,"reb":1,"pf":0},{"ig":"ig390","m":6,"bat":1,"reb":0,"pf":0},{"ig":"ig418","m":1,"bat":4,"reb":0,"pf":0},{"ig":"ig424","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig471","m":1,"bat":1,"reb":1,"pf":0},{"ig":"ig29","m":5,"bat":1,"reb":0,"pf":0},{"ig":"ig73","m":2,"bat":0,"reb":1,"pf":0},{"ig":"ig93","m":1,"bat":4,"reb":2,"pf":0},{"ig":"ig121","m":1,"bat":8,"reb":2,"pf":0},{"ig":"ig121","m":4,"bat":4,"reb":0,"pf":0},{"ig":"ig370","m":1,"bat":5,"reb":0,"pf":0},{"ig":"ig485","m":4,"bat":6,"reb":1,"pf":0},{"ig":"ig485","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig503","m":5,"bat":1,"reb":0,"pf":0},{"ig":"ig503","m":1,"bat":2,"reb":0,"pf":0},{"ig":"ig7","m":1,"bat":2,"reb":0,"pf":1},{"ig":"ig191","m":6,"bat":1,"reb":0,"pf":0},{"ig":"ig206","m":4,"bat":0,"reb":1,"pf":0},{"ig":"ig206","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig286","m":5,"bat":1,"reb":0,"pf":0},{"ig":"ig464","m":1,"bat":3,"reb":0,"pf":0},{"ig":"ig489","m":3,"bat":2,"reb":0,"pf":0},{"ig":"ig60","m":4,"bat":1,"reb":1,"pf":0},{"ig":"ig60","m":1,"bat":2,"reb":0,"pf":0},{"ig":"ig66","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig69","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig69","m":2,"bat":3,"reb":0,"pf":0},{"ig":"ig129","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig135","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig135","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig240","m":3,"bat":2,"reb":0,"pf":0},{"ig":"ig253","m":1,"bat":1,"reb":2,"pf":0},{"ig":"ig253","m":4,"bat":1,"reb":1,"pf":0},{"ig":"ig450","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig49","m":1,"bat":4,"reb":0,"pf":0},{"ig":"ig85","m":1,"bat":3,"reb":0,"pf":0},{"ig":"ig85","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig179","m":3,"bat":0,"reb":0,"pf":1},{"ig":"ig179","m":1,"bat":1,"reb":1,"pf":1},{"ig":"ig179","m":4,"bat":2,"reb":0,"pf":0},{"ig":"ig248","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig248","m":3,"bat":6,"reb":0,"pf":0},{"ig":"ig320","m":1,"bat":2,"reb":0,"pf":1},{"ig":"ig320","m":4,"bat":2,"reb":0,"pf":0},{"ig":"ig461","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig83","m":2,"bat":2,"reb":0,"pf":0},{"ig":"ig233","m":2,"bat":1,"reb":0,"pf":0},{"ig":"ig234","m":1,"bat":3,"reb":0,"pf":0},{"ig":"ig234","m":4,"bat":2,"reb":0,"pf":0},{"ig":"ig247","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig254","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig338","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig457","m":1,"bat":3,"reb":0,"pf":0},{"ig":"ig457","m":3,"bat":3,"reb":0,"pf":0},{"ig":"ig457","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig463","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig23","m":5,"bat":0,"reb":2,"pf":0},{"ig":"ig27","m":3,"bat":0,"reb":2,"pf":0},{"ig":"ig96","m":3,"bat":5,"reb":0,"pf":0},{"ig":"ig96","m":5,"bat":0,"reb":1,"pf":0},{"ig":"ig122","m":1,"bat":3,"reb":0,"pf":0},{"ig":"ig259","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig259","m":4,"bat":0,"reb":1,"pf":0},{"ig":"ig259","m":5,"bat":0,"reb":1,"pf":0},{"ig":"ig317","m":4,"bat":2,"reb":0,"pf":0},{"ig":"ig317","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig317","m":2,"bat":2,"reb":0,"pf":0},{"ig":"ig524","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig2","m":4,"bat":2,"reb":0,"pf":0},{"ig":"ig2","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig71","m":1,"bat":2,"reb":2,"pf":0},{"ig":"ig71","m":6,"bat":1,"reb":0,"pf":0},{"ig":"ig173","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig173","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig173","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig364","m":6,"bat":1,"reb":0,"pf":0},{"ig":"ig421","m":4,"bat":2,"reb":0,"pf":0},{"ig":"ig421","m":1,"bat":9,"reb":0,"pf":0},{"ig":"ig421","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig441","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig34","m":4,"bat":0,"reb":2,"pf":0},{"ig":"ig59","m":4,"bat":2,"reb":0,"pf":0},{"ig":"ig59","m":1,"bat":3,"reb":1,"pf":0},{"ig":"ig74","m":1,"bat":4,"reb":1,"pf":0},{"ig":"ig74","m":5,"bat":3,"reb":1,"pf":0},{"ig":"ig128","m":1,"bat":6,"reb":0,"pf":0},{"ig":"ig128","m":5,"bat":0,"reb":2,"pf":0},{"ig":"ig128","m":4,"bat":3,"reb":0,"pf":0},{"ig":"ig187","m":5,"bat":3,"reb":0,"pf":0},{"ig":"ig187","m":1,"bat":6,"reb":2,"pf":0},{"ig":"ig187","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig192","m":1,"bat":3,"reb":0,"pf":0},{"ig":"ig192","m":4,"bat":5,"reb":0,"pf":0},{"ig":"ig192","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig356","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig403","m":1,"bat":4,"reb":0,"pf":0},{"ig":"ig403","m":4,"bat":1,"reb":1,"pf":0},{"ig":"ig415","m":5,"bat":1,"reb":0,"pf":0},{"ig":"ig499","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig499","m":1,"bat":1,"reb":1,"pf":0},{"ig":"ig499","m":5,"bat":2,"reb":0,"pf":0},{"ig":"ig164","m":3,"bat":0,"reb":1,"pf":0},{"ig":"ig252","m":1,"bat":3,"reb":2,"pf":0},{"ig":"ig423","m":1,"bat":3,"reb":0,"pf":0},{"ig":"ig520","m":1,"bat":4,"reb":2,"pf":0},{"ig":"ig126","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig126","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig130","m":1,"bat":3,"reb":1,"pf":0},{"ig":"ig130","m":4,"bat":2,"reb":1,"pf":0},{"ig":"ig178","m":1,"bat":3,"reb":1,"pf":0},{"ig":"ig178","m":5,"bat":0,"reb":1,"pf":0},{"ig":"ig396","m":4,"bat":3,"reb":0,"pf":1},{"ig":"ig396","m":1,"bat":1,"reb":1,"pf":0},{"ig":"ig8","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig8","m":2,"bat":1,"reb":0,"pf":0},{"ig":"ig42","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig332","m":3,"bat":2,"reb":0,"pf":0},{"ig":"ig336","m":3,"bat":0,"reb":1,"pf":0},{"ig":"ig336","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig351","m":4,"bat":0,"reb":1,"pf":0},{"ig":"ig468","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig504","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig275","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig275","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig382","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig382","m":2,"bat":1,"reb":0,"pf":0},{"ig":"ig383","m":4,"bat":1,"reb":1,"pf":0},{"ig":"ig15","m":1,"bat":2,"reb":0,"pf":0},{"ig":"ig84","m":1,"bat":5,"reb":0,"pf":0},{"ig":"ig84","m":4,"bat":2,"reb":0,"pf":0},{"ig":"ig84","m":2,"bat":1,"reb":0,"pf":0},{"ig":"ig181","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig181","m":6,"bat":1,"reb":0,"pf":0},{"ig":"ig204","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig425","m":2,"bat":0,"reb":1,"pf":0},{"ig":"ig438","m":4,"bat":3,"reb":0,"pf":0},{"ig":"ig486","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig523","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig523","m":1,"bat":2,"reb":2,"pf":0},{"ig":"ig63","m":1,"bat":6,"reb":1,"pf":0},{"ig":"ig63","m":4,"bat":3,"reb":0,"pf":0},{"ig":"ig166","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig166","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig182","m":4,"bat":4,"reb":1,"pf":0},{"ig":"ig251","m":4,"bat":2,"reb":0,"pf":0},{"ig":"ig251","m":1,"bat":5,"reb":0,"pf":0},{"ig":"ig283","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig347","m":1,"bat":2,"reb":0,"pf":0},{"ig":"ig405","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig405","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig405","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig447","m":1,"bat":4,"reb":0,"pf":0},{"ig":"ig467","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig473","m":1,"bat":1,"reb":2,"pf":0},{"ig":"ig473","m":4,"bat":2,"reb":0,"pf":0},{"ig":"ig484","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig488","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig488","m":1,"bat":2,"reb":0,"pf":0},{"ig":"ig6","m":1,"bat":3,"reb":0,"pf":0},{"ig":"ig76","m":1,"bat":2,"reb":1,"pf":0},{"ig":"ig76","m":2,"bat":6,"reb":0,"pf":0},{"ig":"ig76","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig76","m":6,"bat":1,"reb":1,"pf":0},{"ig":"ig76","m":3,"bat":2,"reb":0,"pf":0},{"ig":"ig194","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig197","m":1,"bat":1,"reb":2,"pf":0},{"ig":"ig197","m":4,"bat":0,"reb":1,"pf":0},{"ig":"ig198","m":4,"bat":1,"reb":0,"pf":1},{"ig":"ig203","m":4,"bat":2,"reb":1,"pf":0},{"ig":"ig203","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig271","m":1,"bat":5,"reb":0,"pf":0},{"ig":"ig10","m":1,"bat":3,"reb":0,"pf":0},{"ig":"ig53","m":4,"bat":6,"reb":0,"pf":0},{"ig":"ig105","m":1,"bat":4,"reb":0,"pf":0},{"ig":"ig123","m":4,"bat":3,"reb":0,"pf":0},{"ig":"ig169","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig205","m":1,"bat":4,"reb":0,"pf":0},{"ig":"ig276","m":1,"bat":0,"reb":3,"pf":0},{"ig":"ig393","m":1,"bat":4,"reb":0,"pf":0},{"ig":"ig393","m":4,"bat":3,"reb":0,"pf":0},{"ig":"ig430","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig40","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig98","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig98","m":1,"bat":4,"reb":0,"pf":0},{"ig":"ig107","m":1,"bat":3,"reb":0,"pf":0},{"ig":"ig167","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig168","m":5,"bat":1,"reb":0,"pf":0},{"ig":"ig168","m":3,"bat":2,"reb":0,"pf":0},{"ig":"ig250","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig312","m":1,"bat":1,"reb":1,"pf":0},{"ig":"ig312","m":2,"bat":2,"reb":1,"pf":0},{"ig":"ig312","m":4,"bat":3,"reb":0,"pf":0},{"ig":"ig350","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig200","m":4,"bat":1,"reb":1,"pf":0},{"ig":"ig200","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig200","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig200","m":2,"bat":1,"reb":0,"pf":0},{"ig":"ig222","m":1,"bat":4,"reb":1,"pf":0},{"ig":"ig222","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig307","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig333","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig333","m":4,"bat":3,"reb":2,"pf":0},{"ig":"ig333","m":5,"bat":1,"reb":0,"pf":0},{"ig":"ig333","m":1,"bat":0,"reb":0,"pf":1},{"ig":"ig352","m":4,"bat":3,"reb":0,"pf":0},{"ig":"ig352","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig353","m":5,"bat":1,"reb":0,"pf":0},{"ig":"ig353","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig353","m":3,"bat":8,"reb":0,"pf":0},{"ig":"ig515","m":5,"bat":1,"reb":0,"pf":0},{"ig":"ig9","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig111","m":4,"bat":0,"reb":1,"pf":0},{"ig":"ig147","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig147","m":4,"bat":0,"reb":1,"pf":0},{"ig":"ig147","m":5,"bat":1,"reb":0,"pf":0},{"ig":"ig162","m":1,"bat":2,"reb":0,"pf":0},{"ig":"ig195","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig195","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig195","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig218","m":5,"bat":2,"reb":0,"pf":0},{"ig":"ig218","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig339","m":2,"bat":0,"reb":1,"pf":0},{"ig":"ig339","m":5,"bat":1,"reb":0,"pf":0},{"ig":"ig379","m":4,"bat":0,"reb":2,"pf":0},{"ig":"ig379","m":2,"bat":1,"reb":0,"pf":0},{"ig":"ig379","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig379","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig477","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig483","m":1,"bat":2,"reb":1,"pf":0},{"ig":"ig18","m":4,"bat":2,"reb":1,"pf":0},{"ig":"ig90","m":1,"bat":2,"reb":0,"pf":0},{"ig":"ig125","m":1,"bat":0,"reb":3,"pf":0},{"ig":"ig125","m":4,"bat":2,"reb":0,"pf":0},{"ig":"ig385","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig402","m":5,"bat":0,"reb":1,"pf":0},{"ig":"ig420","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig436","m":2,"bat":3,"reb":0,"pf":0},{"ig":"ig446","m":1,"bat":7,"reb":2,"pf":0},{"ig":"ig446","m":3,"bat":2,"reb":0,"pf":0},{"ig":"ig459","m":1,"bat":2,"reb":0,"pf":0},{"ig":"ig506","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig14","m":5,"bat":1,"reb":0,"pf":0},{"ig":"ig14","m":3,"bat":3,"reb":1,"pf":0},{"ig":"ig14","m":2,"bat":1,"reb":2,"pf":0},{"ig":"ig14","m":1,"bat":2,"reb":0,"pf":0},{"ig":"ig19","m":2,"bat":0,"reb":1,"pf":0},{"ig":"ig19","m":3,"bat":0,"reb":1,"pf":0},{"ig":"ig297","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig298","m":1,"bat":2,"reb":0,"pf":0},{"ig":"ig298","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig298","m":5,"bat":2,"reb":0,"pf":0},{"ig":"ig299","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig299","m":3,"bat":1,"reb":1,"pf":0},{"ig":"ig300","m":1,"bat":2,"reb":2,"pf":0},{"ig":"ig345","m":1,"bat":4,"reb":1,"pf":0},{"ig":"ig77","m":2,"bat":1,"reb":0,"pf":0},{"ig":"ig77","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig77","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig152","m":4,"bat":2,"reb":0,"pf":0},{"ig":"ig165","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig325","m":1,"bat":3,"reb":1,"pf":0},{"ig":"ig361","m":4,"bat":2,"reb":0,"pf":0},{"ig":"ig361","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig149","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig265","m":1,"bat":8,"reb":0,"pf":0},{"ig":"ig265","m":5,"bat":0,"reb":1,"pf":0},{"ig":"ig302","m":6,"bat":1,"reb":0,"pf":0},{"ig":"ig302","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig387","m":1,"bat":3,"reb":0,"pf":0},{"ig":"ig387","m":2,"bat":0,"reb":1,"pf":0},{"ig":"ig412","m":4,"bat":3,"reb":1,"pf":0},{"ig":"ig16","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig108","m":2,"bat":2,"reb":0,"pf":0},{"ig":"ig208","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig244","m":4,"bat":5,"reb":1,"pf":0},{"ig":"ig244","m":1,"bat":1,"reb":1,"pf":0},{"ig":"ig258","m":1,"bat":2,"reb":0,"pf":0},{"ig":"ig288","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig288","m":4,"bat":0,"reb":1,"pf":0},{"ig":"ig314","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig314","m":3,"bat":0,"reb":0,"pf":1},{"ig":"ig389","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig389","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig501","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig501","m":1,"bat":3,"reb":1,"pf":0},{"ig":"ig30","m":2,"bat":1,"reb":0,"pf":0},{"ig":"ig150","m":2,"bat":1,"reb":0,"pf":0},{"ig":"ig150","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig268","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig268","m":4,"bat":1,"reb":1,"pf":0},{"ig":"ig304","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig329","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig513","m":1,"bat":0,"reb":0,"pf":1},{"ig":"ig211","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig211","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig211","m":2,"bat":1,"reb":0,"pf":0},{"ig":"ig219","m":2,"bat":1,"reb":0,"pf":0},{"ig":"ig225","m":1,"bat":5,"reb":2,"pf":0},{"ig":"ig225","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig226","m":1,"bat":2,"reb":1,"pf":0},{"ig":"ig226","m":4,"bat":3,"reb":0,"pf":0},{"ig":"ig226","m":2,"bat":0,"reb":1,"pf":0},{"ig":"ig227","m":4,"bat":1,"reb":1,"pf":0},{"ig":"ig227","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig237","m":4,"bat":3,"reb":0,"pf":0},{"ig":"ig237","m":1,"bat":4,"reb":0,"pf":0},{"ig":"ig237","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig301","m":2,"bat":0,"reb":1,"pf":0},{"ig":"ig301","m":4,"bat":1,"reb":2,"pf":0},{"ig":"ig301","m":1,"bat":3,"reb":0,"pf":0},{"ig":"ig313","m":3,"bat":0,"reb":1,"pf":0},{"ig":"ig313","m":1,"bat":8,"reb":0,"pf":0},{"ig":"ig359","m":1,"bat":5,"reb":0,"pf":0},{"ig":"ig494","m":2,"bat":2,"reb":0,"pf":0},{"ig":"ig494","m":1,"bat":4,"reb":0,"pf":0},{"ig":"ig37","m":1,"bat":4,"reb":1,"pf":0},{"ig":"ig171","m":1,"bat":1,"reb":2,"pf":0},{"ig":"ig171","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig189","m":1,"bat":6,"reb":0,"pf":0},{"ig":"ig189","m":4,"bat":1,"reb":1,"pf":0},{"ig":"ig189","m":5,"bat":1,"reb":0,"pf":0},{"ig":"ig334","m":1,"bat":6,"reb":1,"pf":0},{"ig":"ig334","m":2,"bat":1,"reb":1,"pf":0},{"ig":"ig334","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig440","m":1,"bat":5,"reb":0,"pf":0},{"ig":"ig440","m":2,"bat":3,"reb":0,"pf":0},{"ig":"ig214","m":1,"bat":1,"reb":3,"pf":0},{"ig":"ig214","m":4,"bat":0,"reb":1,"pf":0},{"ig":"ig295","m":4,"bat":3,"reb":0,"pf":0},{"ig":"ig372","m":2,"bat":0,"reb":2,"pf":0},{"ig":"ig372","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig374","m":1,"bat":3,"reb":0,"pf":0},{"ig":"ig374","m":5,"bat":1,"reb":0,"pf":0},{"ig":"ig374","m":3,"bat":0,"reb":1,"pf":0},{"ig":"ig408","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig408","m":1,"bat":0,"reb":1,"pf":0},{"ig":"ig516","m":1,"bat":4,"reb":4,"pf":0},{"ig":"ig277","m":3,"bat":1,"reb":0,"pf":0},{"ig":"ig277","m":1,"bat":2,"reb":1,"pf":0},{"ig":"ig277","m":4,"bat":2,"reb":0,"pf":0},{"ig":"ig303","m":4,"bat":1,"reb":1,"pf":0},{"ig":"ig305","m":1,"bat":8,"reb":0,"pf":0},{"ig":"ig305","m":2,"bat":1,"reb":0,"pf":0},{"ig":"ig305","m":4,"bat":1,"reb":0,"pf":0},{"ig":"ig306","m":1,"bat":3,"reb":2,"pf":0},{"ig":"ig511","m":1,"bat":14,"reb":1,"pf":0},{"ig":"ig511","m":3,"bat":6,"reb":1,"pf":0},{"ig":"ig511","m":4,"bat":5,"reb":0,"pf":0},{"ig":"ig511","m":5,"bat":1,"reb":1,"pf":0},{"ig":"ig518","m":1,"bat":1,"reb":0,"pf":0},{"ig":"ig526","m":4,"bat":2,"reb":1,"pf":0}]};

const C = {
  blue:"#1A6BB0", blueDark:"#0E3A66", blueLight:"#4E93CC", blueSoft:"#E8F1FA",
  bg:"#EEF4FA", card:"#FFFFFF", ink:"#102A45", muted:"#5C748A", faint:"#93A6B8",
  line:"#DBE7F1", green:"#2E9E6B", greenSoft:"#E4F4EC", amber:"#C98A2B", amberSoft:"#FAF0DC",
  shadow:"0 1px 2px rgba(14,58,102,.05), 0 8px 24px rgba(14,58,102,.06)",
  grad:"linear-gradient(135deg, #1A6BB0 0%, #0E3A66 100%)",
};
const MES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const CAMPANHAS = ["Calebe","Semana Santa","Reencontro","Primavera","Sprint Final"];
const CAMP_MESES = { "Calebe":[1,2], "Semana Santa":[3,4,5], "Reencontro":[6,7], "Primavera":[8,9], "Sprint Final":[10,11,12] };
const campanhaDoMes = (m) => m<=2?"Calebe":m<=5?"Semana Santa":m<=7?"Reencontro":m<=9?"Primavera":"Sprint Final";
const periodoCampanha = (c) => CAMP_MESES[c].map(m=>MES[m-1]).join("–");

const bapt = (b) => b.bat + b.reb;          // batismos + rebatismos
const allAd = (b) => b.bat + b.reb + b.pf;  // total de adições

function buildInitial(){
  const ig2d = Object.fromEntries(SEED.igrejas.map(i=>[i.id,i.distritoId]));
  const real = {};
  SEED.distritos.forEach(d=>{ real[d.id]={}; CAMPANHAS.forEach(c=>real[d.id][c]=0); });
  SEED.batismos.forEach(b=>{ const did=ig2d[b.ig]; if(!did||!real[did])return; real[did][campanhaDoMes(b.m)] += (b.bat+b.reb); });
  const previsoes = [];
  SEED.distritos.forEach(d => CAMPANHAS.forEach(c => previsoes.push({ distritoId:d.id, campanha:c, previsto:20, realizado:real[d.id][c]||0, acoes:"", acoesEstudo:"" })));
  const pastores=[]; const byName={};
  const distritos=SEED.distritos.map(d=>{ const nome=(d.pastor||"Pastor").trim(); if(!byName[nome]){ const id="pa"+(pastores.length+1); byName[nome]=id; pastores.push({id,nome}); } return {...d, pastorId:byName[nome]}; });
  const avisos = [
    { id:"a1", de:"Presidência", texto:"Importação do ACMS concluída (jan–jun/2026). Confiram seus distritos.", data:"26/06" },
    { id:"a2", de:"Liderança regional", texto:"Preencham a previsão da campanha Reencontro (julho).", data:"24/06" },
  ];
  return { ...SEED, distritos, pastores, anoAtivo:2026, historicoGestao:[], pontosBanco:{},
    usuarios:[{id:"u-dev",nome:"Suevanio",email:"suevaniocdf@gmail.com",funcao:"desenvolvedor",regiaoId:"",distritoId:"",senha:"2012",perguntaChave:"",respostaChave:"",autorizado:true}],
    formularios:[], previsoes, avisos,
    alvosCampanha:{}, confirmacoes:{}, resgates:[], sorteios:[], premioSorteio:"",
    premios:[
      { id:"pr1", nome:"Vale-combustível", pontos:3000, foto:"⛽", descricao:"Apoio ao deslocamento missionário" },
      { id:"pr2", nome:"Kit de livros do Espírito de Profecia", pontos:1500, foto:"📚", descricao:"" },
      { id:"pr3", nome:"Diária em retiro pastoral", pontos:5000, foto:"🏨", descricao:"Hospedagem para casal" },
    ] };
}

/* persistence */

/* ---------- UI atoms ---------- */
const Eyebrow = ({children,color=C.muted}) => <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.18em",textTransform:"uppercase",color}}>{children}</div>;
const Card = ({children,style}) => <div style={{background:C.card,border:`1px solid ${C.line}`,borderRadius:16,padding:18,boxShadow:C.shadow,...style}}>{children}</div>;

function Stat({icon:Icon,label,value,sub,tint=C.blue,tintSoft=C.blueSoft}){
  return (
    <Card style={{display:"flex",flexDirection:"column",gap:10,minWidth:0,borderTop:`3px solid ${tint}`}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:36,height:36,borderRadius:11,background:tintSoft,display:"grid",placeItems:"center",flexShrink:0}}><Icon size={19} color={tint}/></div>
        <Eyebrow>{label}</Eyebrow>
      </div>
      <div style={{fontFamily:"Sora,sans-serif",fontSize:30,fontWeight:700,color:C.blueDark,lineHeight:1}}>{value}</div>
      {sub && <div style={{fontSize:12.5,color:C.muted}}>{sub}</div>}
    </Card>
  );
}
function Progress({value,goal,tint=C.blue}){
  const real = goal>0?Math.round(value/goal*100):0;
  const fill = Math.min(100,real);
  const over = real>100;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:7,gap:8,flexWrap:"wrap"}}>
        <span style={{fontSize:13,color:C.muted}}>{value} de {goal}</span>
        <span style={{display:"inline-flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:13,fontWeight:700,color:over?C.green:tint}}>{real}%</span>
          {over && <span style={{fontSize:11,fontWeight:700,color:C.green,background:C.greenSoft,padding:"2px 7px",borderRadius:99}}>+{real-100}% acima da meta</span>}
        </span>
      </div>
      <div style={{height:9,background:C.blueSoft,borderRadius:99,overflow:"hidden"}}>
        <div style={{width:`${fill}%`,height:"100%",background:over?C.green:tint,borderRadius:99,transition:"width .5s ease"}}/>
      </div>
    </div>
  );
}
function Field({label,children}){
  return <label style={{display:"flex",flexDirection:"column",gap:6,minWidth:0}}><span style={{fontSize:12,fontWeight:600,color:C.muted}}>{label}</span>{children}</label>;
}
const inputStyle = {border:`1px solid ${C.line}`,borderRadius:10,padding:"10px 12px",fontSize:14,color:C.ink,background:"#fff",outline:"none",width:"100%",boxSizing:"border-box"};
const Select = (p) => <select {...p} style={{...inputStyle,appearance:"none",cursor:"pointer"}}/>;
function Btn({children,onClick,variant="solid",icon:Icon,small}){
  const base={display:"inline-flex",alignItems:"center",gap:7,borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:small?13:14,padding:small?"8px 12px":"10px 16px",border:"1px solid transparent",transition:"filter .15s"};
  const st={solid:{...base,background:C.grad,color:"#fff",boxShadow:"0 4px 12px rgba(14,58,102,.18)"},ghost:{...base,background:"#fff",color:C.blue,border:`1px solid ${C.line}`},soft:{...base,background:C.blueSoft,color:C.blue}}[variant];
  return <button onClick={onClick} style={st} onMouseDown={e=>e.currentTarget.style.filter="brightness(.94)"} onMouseUp={e=>e.currentTarget.style.filter="none"} onMouseLeave={e=>e.currentTarget.style.filter="none"}>{Icon&&<Icon size={small?15:17}/>}{children}</button>;
}
const Mini = ({label,value}) => <div><div style={{fontSize:11,color:C.faint,letterSpacing:".04em"}}>{label}</div><div style={{fontSize:16,fontWeight:700,color:C.ink,fontFamily:"Sora,sans-serif"}}>{value}</div></div>;
const Pill = ({icon:Icon,value,tint}) => <span style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:13,fontWeight:700,color:tint}}><Icon size={14}/>{value}</span>;
const Empty = ({texto}) => <div style={{textAlign:"center",padding:"28px 10px",color:C.faint,fontSize:13.5}}>{texto}</div>;
const Bloco = ({titulo,children}) => <div style={{border:`1px solid ${C.line}`,borderRadius:12,padding:14,display:"flex",flexDirection:"column",gap:14}}><div style={{fontSize:13,fontWeight:700,color:C.blue}}>{titulo}</div>{children}</div>;
const Note = ({children}) => <div style={{display:"flex",gap:9,alignItems:"flex-start",background:C.amberSoft,border:`1px solid ${C.line}`,borderRadius:12,padding:"10px 14px"}}><Info size={16} color={C.amber} style={{marginTop:1,flexShrink:0}}/><div style={{fontSize:12.5,color:C.ink}}>{children}</div></div>;

/* tipo: igreja | grupo */
const tipoDe = (ig) => (ig && ig.tipo==="grupo" ? "grupo" : "igreja");
const optLabel = (ig) => ig.nome + (tipoDe(ig)==="grupo" ? " — Grupo" : "");
const TipoTag = ({tipo}) => tipo==="grupo"
  ? <span style={{fontSize:10,fontWeight:700,color:C.amber,background:C.amberSoft,padding:"2px 6px",borderRadius:6,letterSpacing:".03em",flexShrink:0}}>GRUPO</span>
  : null;

/* ---------- queries ---------- */
function makeQueries(data){
  const dById = Object.fromEntries(data.distritos.map(d=>[d.id,d]));
  const igById = Object.fromEntries(data.igrejas.map(i=>[i.id,i]));
  const churchesIn = ({regiaoId,distritoId,igrejaId,tipo}) => data.igrejas.filter(ig=>{
    if(tipo && tipoDe(ig)!==tipo) return false;
    if(igrejaId) return ig.id===igrejaId;
    if(distritoId) return ig.distritoId===distritoId;
    if(regiaoId) return dById[ig.distritoId]?.regiaoId===regiaoId;
    return true;
  });
  return { dById, igById, churchesIn };
}
const batCells = (data, idSet) => data.batismos.filter(b=>idSet.has(b.ig));
const estudosTotal = (f) => f.estudosDuplas+f.estudosClasses+f.estudosOutras;

/* ===== Bloco único de filtros (estrutura + campanha) ===== */
function BarraFiltros({data, filtros, setFiltros, lockRegiaoId}){
  const lock = lockRegiaoId||"";
  const regiaoId = lock||filtros.regiaoId;
  const distritosVis = data.distritos.filter(d=>!regiaoId||d.regiaoId===regiaoId);
  const limpo = !filtros.regiaoId&&!filtros.distritoId;
  return (
    <Card style={{background:"#eef5fc",border:`1px solid #dbe8f5`}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:13}}>
        <SlidersHorizontal size={17} color={C.blue}/>
        <div><Eyebrow color={C.blue}>Filtros</Eyebrow><div style={{fontFamily:"Sora,sans-serif",fontSize:15,fontWeight:600,color:C.ink,marginTop:1}}>Região e distrito</div></div>
        {!limpo && !lock && <button onClick={()=>setFiltros(f=>({...f,regiaoId:"",distritoId:""}))} style={{marginLeft:"auto",padding:"7px 12px",borderRadius:9,border:`1px solid #cfe0f2`,background:"#fff",fontSize:12.5,fontWeight:600,color:C.muted,cursor:"pointer"}}>Limpar</button>}
      </div>
      <div style={{display:"grid",gap:11,gridTemplateColumns:"repeat(auto-fit, minmax(170px, 1fr))"}}>
        <Field label="Região"><Select value={regiaoId} disabled={!!lock} onChange={e=>setFiltros(f=>({...f,regiaoId:e.target.value,distritoId:""}))}>{!lock&&<option value="">Todas as regiões</option>}{data.regioes.map(r=><option key={r.id} value={r.id}>{r.nome}</option>)}</Select></Field>
        <Field label="Distrito"><Select value={filtros.distritoId} onChange={e=>setFiltros(f=>({...f,distritoId:e.target.value}))}><option value="">Todos</option>{distritosVis.map(d=><option key={d.id} value={d.id}>{d.nome}</option>)}</Select></Field>
      </div>
    </Card>
  );
}

/* ============ PAINEL LIDERANÇA (Presidente / Líder de Região) ============ */
function PainelLideranca({data, lockRegiaoId, filtros, setFiltros, vista="painel"}){
  const Q = useMemo(()=>makeQueries(data),[data]);
  const [rkNivel,setRkNivel] = useState("igreja");
  const [rkMetrica,setRkMetrica] = useState("batismos");
  const [rkCampanha,setRkCampanha] = useState("Todas");
  const rById = useMemo(()=>Object.fromEntries(data.regioes.map(r=>[r.id,r])),[data]);
  const ft = filtros||{regiaoId:lockRegiaoId||"",distritoId:"",igrejaId:"",tipo:"",mes:"Todos",campanha:"Todas"};
  const campF = ft.campanha||"Todas";
  const regiaoId = lockRegiaoId||ft.regiaoId;
  const mesF = ft.mes&&ft.mes!=="Todos"?Number(ft.mes):null;

  const distritosVis = data.distritos.filter(d=>!regiaoId||d.regiaoId===regiaoId);

  const scope = Q.churchesIn({regiaoId,distritoId:ft.distritoId,igrejaId:ft.igrejaId,tipo:ft.tipo});
  const idSet = new Set(scope.map(i=>i.id));
  const nIgrejas = scope.filter(i=>tipoDe(i)==="igreja").length;
  const nGrupos = scope.filter(i=>tipoDe(i)==="grupo").length;
  const cells = batCells(data, idSet);
  const cellsF = mesF? cells.filter(b=>b.m===mesF) : cells;
  const cellsCamp = campF==="Todas"? cellsF : cellsF.filter(b=>campanhaDoMes(b.m)===campF);
  const totBatAno = cells.reduce((a,b)=>a+bapt(b),0);
  const totBat = cellsCamp.reduce((a,b)=>a+bapt(b),0);
  const sumB = cellsCamp.reduce((a,b)=>a+b.bat,0), sumR = cellsCamp.reduce((a,b)=>a+b.reb,0);
  const forms = data.formularios.filter(f=>idSet.has(f.igrejaId));
  const formsCamp = campF==="Todas"? forms : forms.filter(f=>campanhaDoMes(f.mes)===campF);
  const totEst = formsCamp.reduce((a,f)=>a+estudosTotal(f),0);

  const distritosEscopo = ft.distritoId? data.distritos.filter(d=>d.id===ft.distritoId) : distritosVis;
  const metaBat = distritosEscopo.reduce((a,d)=>a+d.metaBatismo,0);
  const metaEst = distritosEscopo.reduce((a,d)=>a+d.metaEstudo,0);

  const serie = useMemo(()=>{ let acc=0; return MES.map((m,idx)=>{ const q=cells.filter(b=>b.m===idx+1).reduce((a,b)=>a+bapt(b),0); acc+=q; return {mes:m,"Mês":q,Acumulado:acc}; }); },[cells]);

  const rankingFull = useMemo(()=>{
    let recs=cells;
    if(mesF) recs=recs.filter(b=>b.m===mesF);
    if(rkCampanha!=="Todas") recs=recs.filter(b=>campanhaDoMes(b.m)===rkCampanha);
    let frecs=forms;
    if(rkCampanha!=="Todas") frecs=frecs.filter(f=>campanhaDoMes(f.mes)===rkCampanha);
    const map={};
    const ensure=(key,nome,tipo)=>{ if(!map[key]) map[key]={nome,bat:0,estMes:{},tipo}; return map[key]; };
    const kn=(ig)=>{ const dist=Q.dById[ig.distritoId]; if(rkNivel==="igreja") return {key:ig.id,nome:ig.nome,tipo:tipoDe(ig)}; if(rkNivel==="regiao"){ const r=rById[dist&&dist.regiaoId]; return {key:dist?dist.regiaoId:"?",nome:r?r.nome:"—",tipo:null}; } return {key:ig.distritoId,nome:dist?dist.nome:"—",tipo:null}; };
    recs.forEach(b=>{ const ig=Q.igById[b.ig]; if(!ig)return; const k=kn(ig); ensure(k.key,k.nome,k.tipo).bat+=bapt(b); });
    frecs.forEach(f=>{ const ig=Q.igById[f.igrejaId]; if(!ig)return; const k=kn(ig); const e=ensure(k.key,k.nome,k.tipo); e.estMes[f.mes]=(e.estMes[f.mes]||0)+estudosTotal(f); });
    return Object.values(map).map(x=>{ const meses=Object.values(x.estMes); const est=meses.length?Math.round(meses.reduce((a,v)=>a+v,0)/meses.length):0; return {...x,est,nMeses:meses.length,qtd:rkMetrica==="estudos"?est:x.bat}; }).filter(x=>x.qtd>0).sort((a,b)=>b.qtd-a.qtd);
  },[cells,forms,rkCampanha,mesF,rkNivel,rkMetrica,Q,rById]);
  const ranking = rankingFull.slice(0,15);
  const META_ESTUDO = 200;
  const atingidos = rankingFull.filter(x=>x.est>=META_ESTUDO).length;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <BarraFiltros data={data} filtros={ft} setFiltros={setFiltros} lockRegiaoId={lockRegiaoId}/>

      {vista==="painel" && (<>
      <div style={{display:"grid",gap:14,gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))"}}>
        <Stat icon={Droplets} label={campF==="Todas"?"Batismos":`Batismos · ${campF}`} value={totBat} sub={`${sumB} batismos · ${sumR} rebatismos`}/>
        <Stat icon={Target} label="Meta alcançada (ano)" value={`${metaBat?Math.round(totBatAno/metaBat*100):0}%`} sub={`${totBatAno} de ${metaBat} · faltam ${Math.max(0,metaBat-totBatAno)}`} tint={C.green} tintSoft={C.greenSoft}/>
        <Stat icon={BookOpen} label={campF==="Todas"?"Estudos bíblicos":`Estudos · ${campF}`} value={totEst} sub={campF==="Todas"?`Meta: ${metaEst}`:`na campanha ${campF}`} tint={C.blueLight} tintSoft={C.blueSoft}/>
        <Stat icon={Building2} label="Igrejas e grupos" value={idSet.size} sub={`${nIgrejas} igrejas · ${nGrupos} grupos`} tint={C.amber} tintSoft={C.amberSoft}/>
      </div>

      <Note>Metas de batismo são estimativas provisórias até recebermos os alvos oficiais. Estudos bíblicos começam em zero — são preenchidos pelos líderes via formulário.</Note>

      <Card>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <TrendingUp size={18} color={C.blue}/>
          <div><Eyebrow color={C.blue}>Batismos</Eyebrow><div style={{fontFamily:"Sora,sans-serif",fontSize:17,fontWeight:600,color:C.ink,marginTop:2}}>Progressão das metas anuais</div></div>
        </div>
        <div style={{height:230}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={serie} margin={{top:6,right:8,left:-18,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.line} vertical={false}/>
              <XAxis dataKey="mes" tick={{fontSize:11,fill:C.muted}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:C.muted}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{borderRadius:10,border:`1px solid ${C.line}`,fontSize:13}}/>
              <Line type="monotone" dataKey="Acumulado" stroke={C.blue} strokeWidth={2.5} dot={false}/>
              <Line type="monotone" dataKey="Mês" stroke={C.amber} strokeWidth={2} dot={{r:2.5}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div style={{display:"grid",gap:18,gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))"}}>
        <Card>
          <Eyebrow color={C.blue}>Previsão de batismos</Eyebrow>
          <div style={{fontFamily:"Sora,sans-serif",fontSize:17,fontWeight:600,color:C.ink,margin:"2px 0 14px"}}>Por campanha</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {CAMPANHAS.map(c=>{
              const linhas=data.previsoes.filter(p=>p.campanha===c&&distritosEscopo.some(d=>d.id===p.distritoId));
              const real=linhas.reduce((a,p)=>a+(Number(p.realizado)||0),0);
              const prev=linhas.reduce((a,p)=>a+p.previsto,0);
              return (
                <div key={c}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:13.5,marginBottom:5}}>
                    <span style={{color:C.ink,fontWeight:600}}>{c}</span>
                    <span style={{color:C.muted}}>{real} reais {prev?`/ ${prev} previstos`:""}</span>
                  </div>
                  <Progress value={real} goal={Math.max(prev,real,1)} tint={C.blueLight}/>
                </div>
              );
            })}
          </div>
          <div style={{marginTop:14,fontSize:12,color:C.faint}}>Calebe (jan/fev), Semana Santa (mar–mai), Reencontro (jun/jul), Primavera (ago/set), Sprint Final (out–dez). Previsões preenchidas pelos pastores.</div>
        </Card>

        <Card>
          <Eyebrow color={C.blue}>Estudos</Eyebrow>
          <div style={{fontFamily:"Sora,sans-serif",fontSize:17,fontWeight:600,color:C.ink,margin:"2px 0 14px"}}>{campF==="Todas"?"Meta de estudo por distrito (200)":`Estudos por distrito · ${campF}`}</div>
          <div style={{display:"flex",flexDirection:"column",gap:14,maxHeight:280,overflowY:"auto"}}>
            {distritosEscopo.map(d=>{
              const ids=new Set(data.igrejas.filter(i=>i.distritoId===d.id).map(i=>i.id));
              const tot=data.formularios.filter(f=>ids.has(f.igrejaId)&&(campF==="Todas"||campanhaDoMes(f.mes)===campF)).reduce((a,f)=>a+estudosTotal(f),0);
              return <div key={d.id}><div style={{fontSize:13.5,fontWeight:600,color:C.ink,marginBottom:6}}>{d.nome}</div><Progress value={tot} goal={d.metaEstudo} tint={C.green}/></div>;
            })}
          </div>
          <div style={{marginTop:14,fontSize:12,color:C.faint}}>Alcançado conforme formulários preenchidos pelos líderes.</div>
        </Card>
      </div>
      </>)}

      {vista==="ranking" && (
      <Card>
        <div style={{display:"flex",flexWrap:"wrap",gap:12,alignItems:"flex-end",marginBottom:14}}>
          <div style={{marginRight:"auto",display:"flex",alignItems:"center",gap:8}}>
            <Trophy size={18} color={C.amber}/>
            <div><Eyebrow color={C.amber}>{rkMetrica==="estudos"?"Ranking de estudos":"Ranking de batismos"}</Eyebrow><div style={{fontFamily:"Sora,sans-serif",fontSize:17,fontWeight:600,color:C.ink,marginTop:2}}>{rkNivel==="igreja"?"Por igreja/grupo":rkNivel==="regiao"?"Por região":"Por distrito"}{rkCampanha!=="Todas"?` · ${rkCampanha}`:""}</div>{rkMetrica==="estudos"&&<div style={{fontSize:11.5,color:C.faint,marginTop:2}}>Média mensal de interessados (os estudos se mantêm de mês a mês)</div>}</div>
          </div>
          <Field label="Campanha"><Select value={rkCampanha} onChange={e=>setRkCampanha(e.target.value)}><option value="Todas">Todas</option>{CAMPANHAS.map(c=><option key={c} value={c}>{c}</option>)}</Select></Field>
          <Field label="Métrica"><Select value={rkMetrica} onChange={e=>setRkMetrica(e.target.value)}><option value="batismos">Batismos</option><option value="estudos">Estudos</option></Select></Field>
          <Field label="Nível"><Select value={rkNivel} onChange={e=>setRkNivel(e.target.value)}><option value="igreja">Por igreja/grupo</option><option value="distrito">Por distrito</option><option value="regiao">Por região</option></Select></Field>
        </div>
        {rkMetrica==="estudos" && ranking.length>0 && <div style={{display:"flex",alignItems:"center",gap:8,background:C.greenSoft,border:"1px solid #cde8d6",borderRadius:10,padding:"9px 13px",marginBottom:14,fontSize:13,color:C.ink}}><Check size={16} color={C.green}/><span><strong>{atingidos}</strong> {atingidos===1?"atingiu":"atingiram"} a meta de {META_ESTUDO} interessados{rkCampanha!=="Todas"?` em ${rkCampanha}`:""} — média mensal dos meses preenchidos.</span></div>}
        {ranking.length===0 ? <Empty texto={rkMetrica==="estudos"?"Nenhum estudo para este filtro.":"Nenhum batismo para este filtro."}/> : (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {ranking.map((r,i)=>{ const max=ranking[0].qtd||1; const atin=r.est>=META_ESTUDO; return (
              <div key={r.nome+i} style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:26,textAlign:"center",fontFamily:"Sora,sans-serif",fontWeight:700,color:i===0?C.amber:i<3?C.blue:C.faint,fontSize:15}}>{i+1}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,gap:8}}>
                    <span style={{display:"flex",alignItems:"center",gap:6,minWidth:0}}><span style={{fontSize:13.5,color:C.ink,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.nome}</span><TipoTag tipo={r.tipo}/></span>
                    <span style={{fontSize:13.5,color:C.muted,fontWeight:700,whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:4}}>
                      {rkMetrica==="estudos"
                        ? <>{r.est} <span style={{fontWeight:500,color:C.faint,fontSize:12}}>/ {META_ESTUDO}</span>{atin && <Check size={14} color={C.green}/>}</>
                        : <>{r.qtd} <span style={{fontWeight:500,color:C.faint,fontSize:12}}>· {r.est} est</span></>}
                    </span>
                  </div>
                  <div style={{height:7,background:C.blueSoft,borderRadius:99}}><div style={{width:`${rkMetrica==="estudos"?Math.min(100,r.est/META_ESTUDO*100):(r.qtd/max*100)}%`,height:"100%",borderRadius:99,background:rkMetrica==="estudos"?(atin?C.green:C.blue):(i===0?C.amber:C.blue)}}/></div>
                </div>
              </div>); })}
          </div>
        )}
      </Card>
      )}
    </div>
  );
}

/* ============ PAINEL PASTOR ============ */
function PainelPastor({data,setData,distritoId}){
  const Q = useMemo(()=>makeQueries(data),[data]);
  const [aba,setAba] = useState("painel");
  const [copiado,setCopiado] = useState(null);
  const [delId,setDelId] = useState(null);
  const [demoForm,setDemoForm] = useState(null);
  const [demo,setDemo] = useState(false);
  const [vgMes,setVgMes] = useState("Todos");
  const distrito = data.distritos.find(d=>d.id===distritoId);
  const igrejas = data.igrejas.filter(i=>i.distritoId===distritoId);
  const idSet = new Set(igrejas.map(i=>i.id));
  const cells = batCells(data,idSet);
  const totBat = cells.reduce((a,b)=>a+bapt(b),0);
  const forms = data.formularios.filter(f=>idSet.has(f.igrejaId));
  const totEst = forms.reduce((a,f)=>a+estudosTotal(f),0);
  const cellsVg = vgMes==="Todos"? cells : cells.filter(b=>b.m===Number(vgMes));
  const totBatVg = cellsVg.reduce((a,b)=>a+bapt(b),0);
  const totEstVg = (vgMes==="Todos"?forms:forms.filter(f=>f.mes===Number(vgMes))).reduce((a,f)=>a+estudosTotal(f),0);
  const rank = igrejas.map(ig=>({nome:ig.nome, tipo:tipoDe(ig), bat:batCells(data,new Set([ig.id])).filter(b=>vgMes==="Todos"||b.m===Number(vgMes)).reduce((a,b)=>a+bapt(b),0), est:data.formularios.filter(f=>f.igrejaId===ig.id&&(vgMes==="Todos"||f.mes===Number(vgMes))).reduce((a,f)=>a+estudosTotal(f),0)})).sort((a,b)=>b.bat-a.bat||b.est-a.est);
  const abas=[{id:"painel",label:"Visão geral",icon:TrendingUp},{id:"ranking",label:"Ranking",icon:BarChart3},{id:"preenchimento",label:"Preenchimentos",icon:ClipboardList},{id:"premiacao",label:"Premiação",icon:Gift}];

  function copiar(ig){ const base=`${window.location.origin}${window.location.pathname}`; const link=`${base}#/f/${distritoId}/${ig.id}`; try{navigator.clipboard?.writeText(link);}catch(e){} setCopiado(ig.id); setTimeout(()=>setCopiado(null),1600); }
  function salvarPrev(camp,campo,val){ setData(d=>({...d,previsoes:d.previsoes.map(p=>p.distritoId===distritoId&&p.campanha===camp?{...p,[campo]:val}:p)})); }

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div className="tabscroll" style={{display:"flex",gap:8,overflowX:"auto",flexWrap:"nowrap",paddingBottom:2,WebkitOverflowScrolling:"touch"}}>
        {abas.map(a=>(<button key={a.id} onClick={()=>setAba(a.id)} style={{flexShrink:0,whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:7,padding:"9px 14px",borderRadius:10,cursor:"pointer",fontSize:13.5,fontWeight:600,border:`1px solid ${aba===a.id?C.blueDark:C.line}`,background:aba===a.id?C.grad:"#fff",color:aba===a.id?"#fff":C.muted,boxShadow:aba===a.id?"0 4px 12px rgba(14,58,102,.18)":"none"}}><a.icon size={15}/>{a.label}</button>))}
      </div>

      <Card style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:14,background:C.grad,border:"none",color:"#fff",boxShadow:"0 8px 24px rgba(14,58,102,.18)"}}>
        <div><Eyebrow color="rgba(255,255,255,.7)">{distrito.pastor||"Pastor"}</Eyebrow><div style={{fontFamily:"Sora,sans-serif",fontSize:22,fontWeight:700,marginTop:3}}>{distrito.nome}</div></div>
        <div style={{marginLeft:"auto",display:"flex",gap:26,flexWrap:"wrap"}}>
          <div><div style={{fontSize:11,opacity:.75,letterSpacing:".1em"}}>ALCANÇADO</div><div style={{fontFamily:"Sora,sans-serif",fontSize:26,fontWeight:700}}>{totBat}</div><div style={{fontSize:11,opacity:.7,marginTop:1}}>de {distrito.metaBatismo} · {distrito.metaBatismo?Math.round(totBat/distrito.metaBatismo*100):0}%</div></div>
          <div><div style={{fontSize:11,opacity:.75,letterSpacing:".1em"}}>FALTAM PARA O ALVO</div><div style={{fontFamily:"Sora,sans-serif",fontSize:26,fontWeight:700}}>{Math.max(0,distrito.metaBatismo-totBat)}</div></div>
        </div>
      </Card>

      {aba==="painel" && (<>
        <Card style={{background:"#eef5fc",border:`1px solid #dbe8f5`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:13}}>
            <SlidersHorizontal size={17} color={C.blue}/>
            <div><Eyebrow color={C.blue}>Filtro</Eyebrow><div style={{fontFamily:"Sora,sans-serif",fontSize:15,fontWeight:600,color:C.ink,marginTop:1}}>Mês</div></div>
          </div>
          <div style={{maxWidth:320}}><Field label="Mês"><Select value={vgMes} onChange={e=>setVgMes(e.target.value)}><option value="Todos">Todos</option>{MES.map((m,i)=><option key={m} value={i+1}>{m}</option>)}</Select></Field></div>
        </Card>
        <div style={{display:"grid",gap:14,gridTemplateColumns:"repeat(auto-fit, minmax(170px,1fr))"}}>
          <Stat icon={Droplets} label={vgMes==="Todos"?"Batismos":`Batismos · ${MES[Number(vgMes)-1]}`} value={totBatVg} sub={vgMes==="Todos"?`Meta: ${distrito.metaBatismo}`:`no ano: ${totBat}`}/>
          <Stat icon={BookOpen} label={vgMes==="Todos"?"Estudos":`Estudos · ${MES[Number(vgMes)-1]}`} value={totEstVg} sub={vgMes==="Todos"?`Meta: ${distrito.metaEstudo}`:`no ano: ${totEst}`} tint={C.blueLight} tintSoft={C.blueSoft}/>
          <Stat icon={Building2} label="Igrejas e grupos" value={igrejas.length} sub={`${igrejas.filter(i=>tipoDe(i)==="igreja").length} igrejas · ${igrejas.filter(i=>tipoDe(i)==="grupo").length} grupos`} tint={C.amber} tintSoft={C.amberSoft}/>
        </div>
        <Card>
          <Eyebrow color={C.blue}>Progresso do distrito {vgMes!=="Todos"?`· ${MES[Number(vgMes)-1]}`:""}</Eyebrow>
          <div style={{display:"flex",flexDirection:"column",gap:18,marginTop:14}}>
            <div><div style={{fontSize:13.5,fontWeight:600,color:C.ink,marginBottom:6}}>Batismos</div><Progress value={totBatVg} goal={distrito.metaBatismo}/></div>
            <div><div style={{fontSize:13.5,fontWeight:600,color:C.ink,marginBottom:6}}>Estudos bíblicos</div><Progress value={totEstVg} goal={distrito.metaEstudo} tint={C.green}/></div>
          </div>
        </Card>
      </>)}

      {aba==="ranking" && (<>
        <Card style={{background:"#eef5fc",border:`1px solid #dbe8f5`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:13}}>
            <SlidersHorizontal size={17} color={C.blue}/>
            <div><Eyebrow color={C.blue}>Filtro</Eyebrow><div style={{fontFamily:"Sora,sans-serif",fontSize:15,fontWeight:600,color:C.ink,marginTop:1}}>Mês</div></div>
          </div>
          <div style={{maxWidth:320}}><Field label="Mês"><Select value={vgMes} onChange={e=>setVgMes(e.target.value)}><option value="Todos">Todos</option>{MES.map((m,i)=><option key={m} value={i+1}>{m}</option>)}</Select></Field></div>
        </Card>
        <Card>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><Trophy size={18} color={C.amber}/><div style={{fontFamily:"Sora,sans-serif",fontSize:16,fontWeight:600,color:C.ink}}>Ranking por igreja/grupo — estudo e batismo{vgMes!=="Todos"?` · ${MES[Number(vgMes)-1]}`:""}</div></div>
          <div style={{display:"flex",flexDirection:"column",gap:10,maxHeight:520,overflowY:"auto"}}>
            {rank.map((r,i)=>(<div key={r.nome+i} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:i<rank.length-1?`1px solid ${C.line}`:"none"}}><div style={{width:22,fontFamily:"Sora,sans-serif",fontWeight:700,color:i===0?C.amber:C.faint}}>{i+1}</div><div style={{flex:1,minWidth:0,display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:14,color:C.ink,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.nome}</span><TipoTag tipo={r.tipo}/></div><Pill icon={Droplets} value={r.bat} tint={C.blue}/><Pill icon={BookOpen} value={r.est} tint={C.green}/></div>))}
          </div>
        </Card>
      </>)}

      {aba==="preenchimento" && (()=>{
        const now=new Date();
        const mes=now.getMonth()+1, ano=now.getFullYear(), dia=now.getDate();
        const aberto = (mes === 7 || dia <= 15) || demo;⁠
        const cap=(s)=>s.charAt(0).toUpperCase()+s.slice(1);
        const nomeMes=cap(MESEXT[mes-1]);
        const proxMes=cap(MESEXT[mes%12]);
        const formsMes=data.formularios.filter(f=>idSet.has(f.igrejaId)&&f.mes===mes&&f.ano===ano);
        const preench = igrejas.length>0 && igrejas.every(ig=>formsMes.some(f=>f.igrejaId===ig.id));
        if(!aberto){
          return (
            <Card>
              <div style={{fontFamily:"Sora,sans-serif",fontSize:16,fontWeight:600,color:C.ink}}>Preenchimento de estudos — {nomeMes}</div>
              <div style={{marginTop:14,background:C.bg,borderRadius:12,padding:18,textAlign:"center"}}>
                <div style={{fontSize:14,fontWeight:600,color:C.ink}}>Preenchimento de {nomeMes} encerrado.</div>
                <div style={{fontSize:12.5,color:C.muted,marginTop:6}}>A janela de julho vai até o final do mês. Reabre em 01 de {proxMes}.</div>
                <label style={{display:"inline-flex",alignItems:"center",gap:7,marginTop:14,fontSize:12.5,color:C.faint,cursor:"pointer"}}><input type="checkbox" checked={demo} onChange={e=>setDemo(e.target.checked)}/> Simular janela aberta (demonstração)</label>
              </div>
            </Card>
          );
        }
        const diasFecha=Math.max(0,15-dia);
        return (
        <Card>
          <div style={{display:"flex",flexWrap:"wrap",gap:10,alignItems:"center"}}>
            <div style={{marginRight:"auto"}}>
              <div style={{fontFamily:"Sora,sans-serif",fontSize:16,fontWeight:600,color:C.ink}}>Preenchimento de estudos — {nomeMes}</div>
              <div style={{fontSize:12,color:C.faint,marginTop:2}}>Janela mensal: Aberto até 31 de Julho⁠
            </div>
            <span style={{fontSize:12,fontWeight:700,color:C.green,background:C.greenSoft,padding:"5px 10px",borderRadius:99,whiteSpace:"nowrap"}}>{dia<=15?`Aberto · faltam ${diasFecha}d`:"Demonstração"}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginTop:14,marginBottom:4,flexWrap:"wrap"}}>
            <span style={{fontSize:12.5,fontWeight:700,color:C.green}}>{dia<=15?`Faltam ${diasFecha} dia(s) para fechar (dia 15)`:"Janela simulada (demonstração)"}</span>
            {preench&&<span style={{fontSize:12,fontWeight:700,color:C.green,background:C.greenSoft,padding:"4px 10px",borderRadius:99}}>100% preenchido</span>}
            {demo&&dia>10&&<label style={{marginLeft:"auto",display:"inline-flex",alignItems:"center",gap:6,fontSize:12,color:C.faint,cursor:"pointer"}}><input type="checkbox" checked={demo} onChange={e=>setDemo(e.target.checked)}/> demonstração</label>}
          </div>
          <p style={{fontSize:13,color:C.muted,margin:"4px 0 12px"}}>Envie o link pelo WhatsApp ao líder de cada igreja ou grupo. Ele preenche pelo celular, sem login, e o resultado aparece aqui e para todos automaticamente.</p>
          <div style={{display:"flex",flexDirection:"column",gap:10,maxHeight:460,overflowY:"auto"}}>
            {igrejas.map(ig=>{ const f=formsMes.find(x=>x.igrejaId===ig.id); return (
              <div key={ig.id} style={{border:`1px solid ${C.line}`,borderRadius:12,padding:14}}>
                <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:10}}>
                  <div style={{minWidth:0,marginRight:"auto",display:"flex",alignItems:"center",gap:7}}><div style={{fontSize:14.5,fontWeight:700,color:C.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ig.nome}</div><TipoTag tipo={tipoDe(ig)}/></div>
                  {f? <span style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:12.5,fontWeight:600,color:C.green,background:C.greenSoft,padding:"5px 10px",borderRadius:99}}><Check size={14}/>Preenchido</span> : <span style={{fontSize:12.5,fontWeight:600,color:C.amber,background:C.amberSoft,padding:"5px 10px",borderRadius:99}}>Pendente</span>}
                  <Btn small variant="soft" icon={copiado===ig.id?Check:Link2} onClick={()=>copiar(ig)}>{copiado===ig.id?"Link copiado":"Copiar link"}</Btn>
                  <Btn small variant="ghost" onClick={()=>setDemoForm({igrejaId:ig.id})}>Preencher</Btn>
                  {f && <button onClick={()=>{ if(delId===f.id){ setData(d=>({...d,formularios:d.formularios.filter(x=>x.id!==f.id)})); setDelId(null); } else setDelId(f.id); }} style={{border:`1px solid ${delId===f.id?"#C0392B":C.line}`,background:delId===f.id?"#C0392B":"#fff",color:delId===f.id?"#fff":"#C0392B",borderRadius:9,padding:"8px 12px",fontSize:13,fontWeight:600,cursor:"pointer"}}>{delId===f.id?"Confirmar exclusão":"Excluir envio"}</button>}
                </div>
                {f && (<div style={{display:"grid",gap:8,gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",marginTop:12,paddingTop:12,borderTop:`1px solid ${C.line}`}}>
                  <Mini label="Duplas" value={f.duplas}/><Mini label="Interessados (duplas)" value={f.estudosDuplas}/><Mini label="Classes" value={f.classes}/><Mini label="Interessados (classes)" value={f.estudosClasses}/><Mini label="Interessados (outras)" value={f.estudosOutras}/>
                </div>)}
              </div>); })}
          </div>
        </Card>
        );
      })()}


      {aba==="premiacao" && <PremiacaoPastor data={data} distritoId={distritoId}/>}

      {demoForm && (
        <div onClick={()=>setDemoForm(null)} style={{position:"fixed",inset:0,background:"rgba(19,40,61,.55)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:50,padding:"24px 16px",overflowY:"auto"}}>
          <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:620}}>
            <FormularioLider data={data} setData={setData} igrejaFixa={demoForm.igrejaId} onClose={()=>setDemoForm(null)}/>
          </div>
        </div>
      )}
    </div>
  );
}

function Cadastro({data,setData,distritoId}){
  const [nome,setNome]=useState(""); const [lider,setLider]=useState(""); const [tipo,setTipo]=useState("igreja");
  const igrejas=data.igrejas.filter(i=>i.distritoId===distritoId);
  const nI=igrejas.filter(i=>tipoDe(i)==="igreja").length, nG=igrejas.filter(i=>tipoDe(i)==="grupo").length;
  function add(){ if(!nome.trim())return; setData(d=>({...d,igrejas:[...d.igrejas,{id:"i"+Date.now(),nome:nome.trim(),distritoId,tipo,lider:lider.trim()||"—",novo:true,confirmadoPresidente:false}]})); setNome("");setLider(""); }
  function mudarTipo(id,t){ setData(d=>({...d,igrejas:d.igrejas.map(ig=>ig.id===id?{...ig,tipo:t}:ig)})); }
  return (
    <Card>
      <div style={{fontFamily:"Sora,sans-serif",fontSize:16,fontWeight:600,color:C.ink}}>Cadastro de igrejas e grupos</div>
      <p style={{fontSize:13,color:C.muted,margin:"6px 0 16px"}}>Cadastre com o nome igual ao dos documentos — o sistema vincula ao seu distrito. Marque cada congregação como Igreja ou Grupo.</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:12,alignItems:"flex-end"}}>
        <Field label="Nome"><input value={nome} onChange={e=>setNome(e.target.value)} style={{...inputStyle,minWidth:180}} placeholder="Ex.: Grupo Boas Novas"/></Field>
        <Field label="Tipo"><Select value={tipo} onChange={e=>setTipo(e.target.value)} style={{...inputStyle,width:130}}><option value="igreja">Igreja</option><option value="grupo">Grupo</option></Select></Field>
        <Field label="Líder responsável"><input value={lider} onChange={e=>setLider(e.target.value)} style={{...inputStyle,minWidth:160}} placeholder="Nome do líder"/></Field>
        <Btn icon={Plus} onClick={add}>Cadastrar</Btn>
      </div>
      <div style={{marginTop:16,fontSize:12.5,color:C.muted}}>{nI} igrejas · {nG} grupos neste distrito</div>
      <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:8,maxHeight:340,overflowY:"auto"}}>
        {igrejas.map(ig=>(<div key={ig.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",border:`1px solid ${C.line}`,borderRadius:10}}><Building2 size={16} color={tipoDe(ig)==="grupo"?C.amber:C.blue}/><span style={{fontSize:14,fontWeight:600,color:C.ink,marginRight:"auto",minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ig.nome}</span><Select value={tipoDe(ig)} onChange={e=>mudarTipo(ig.id,e.target.value)} style={{...inputStyle,width:104,padding:"6px 8px",fontSize:12.5}}><option value="igreja">Igreja</option><option value="grupo">Grupo</option></Select></div>))}
      </div>
    </Card>
  );
}

/* ============ FORMULÁRIO DO LÍDER ============ */
function FormularioLider({data,setData,igrejaFixa,onClose}){
  const [igrejaId,setIgrejaId]=useState(igrejaFixa||data.igrejas[0]?.id||"");
  const [f,setF]=useState({duplas:"",estudosDuplas:"",classes:"",estudosClasses:"",estudosOutras:""});
  const [enviado,setEnviado]=useState(false);
  const [err,setErr]=useState("");
  const now=new Date(); const mes=now.getMonth()+1, ano=now.getFullYear();
  const nomeMes=MESEXT[mes-1].charAt(0).toUpperCase()+MESEXT[mes-1].slice(1);
  const upd=(k,v)=>setF(p=>({...p,[k]:v}));
  function enviar(){
    setErr("");
    const campos=[f.duplas,f.estudosDuplas,f.classes,f.estudosClasses,f.estudosOutras];
    if(campos.some(v=>String(v).trim()==="")){ setErr("Preencha todos os campos. Use apenas números."); return; }
    if(campos.some(v=>!/^\d+$/.test(String(v).trim()))){ setErr("Somente números inteiros (0 ou mais) são aceitos."); return; }
    setData(d=>{ const resto=d.formularios.filter(x=>!(x.igrejaId===igrejaId&&x.mes===mes&&x.ano===ano)); return {...d,formularios:[...resto,{id:"f"+Date.now(),igrejaId,mes,ano,data:new Date().toISOString().slice(0,10),duplas:Number(f.duplas)||0,estudosDuplas:Number(f.estudosDuplas)||0,classes:Number(f.classes)||0,estudosClasses:Number(f.estudosClasses)||0,estudosOutras:Number(f.estudosOutras)||0}]}; });
    setEnviado(true);
  }
  if(enviado) return (
    <div style={{maxWidth:560,margin:"0 auto"}}>
      <Card style={{textAlign:"center",padding:40}}>
        <div style={{width:56,height:56,borderRadius:99,background:C.greenSoft,display:"grid",placeItems:"center",margin:"0 auto 16px"}}><Check size={28} color={C.green}/></div>
        <div style={{fontFamily:"Sora,sans-serif",fontSize:20,fontWeight:700,color:C.ink}}>Formulário enviado</div>
        <p style={{fontSize:14,color:C.muted,marginTop:8}}>Registro de {nomeMes}. Seu pastor já pode visualizar os dados.</p>
        <div style={{marginTop:18,display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}><Btn variant="ghost" onClick={()=>{setEnviado(false);setF({duplas:"",estudosDuplas:"",classes:"",estudosClasses:"",estudosOutras:""});}}>Preencher de novo</Btn>{onClose&&<Btn onClick={onClose}>Fechar</Btn>}</div>
      </Card>
    </div>
  );
  return (
    <div style={{maxWidth:620,margin:"0 auto"}}>
      <Card>
        <Eyebrow color={C.blue}>Formulário missionário · {nomeMes}</Eyebrow>
        <div style={{fontFamily:"Sora,sans-serif",fontSize:20,fontWeight:700,color:C.ink,margin:"4px 0"}}>Relatório de estudos bíblicos</div>
        <p style={{fontSize:13,color:C.muted,marginBottom:20}}>Preencha os dados da sua igreja referentes a {nomeMes}.</p>
        <div style={{display:"flex",flexDirection:"column",gap:18}}>
          {igrejaFixa ? (
            <div style={{background:C.blueSoft,borderRadius:10,padding:"10px 12px",fontSize:13.5,color:C.ink}}>{optLabel(data.igrejas.find(i=>i.id===igrejaId)||{nome:""})} · <strong>{nomeMes}</strong></div>
          ) : (
            <Field label="Qual a sua igreja ou grupo?"><Select value={igrejaId} onChange={e=>setIgrejaId(e.target.value)}>{data.igrejas.map(ig=><option key={ig.id} value={ig.id}>{optLabel(ig)}</option>)}</Select></Field>
          )}
          <Bloco titulo="Duplas missionárias">
            <Field label="Quantas duplas missionárias há na sua igreja?"><input type="number" min={0} value={f.duplas} onChange={e=>upd("duplas",e.target.value.replace(/\D/g,""))} inputMode="numeric" style={inputStyle}/></Field>
            <Field label="Quantos interessados estão recebendo estudos Bíblicos por essas duplas?"><input type="number" min={0} value={f.estudosDuplas} onChange={e=>upd("estudosDuplas",e.target.value.replace(/\D/g,""))} inputMode="numeric" style={inputStyle}/></Field>
          </Bloco>
          <Bloco titulo="Classe bíblica">
            <Field label="Quantas classes bíblicas há na sua igreja?"><input type="number" min={0} value={f.classes} onChange={e=>upd("classes",e.target.value.replace(/\D/g,""))} inputMode="numeric" style={inputStyle}/></Field>
            <Field label="Quantos interessados estão recebendo estudos Bíblicos nessas classes bíblicas?"><input type="number" min={0} value={f.estudosClasses} onChange={e=>upd("estudosClasses",e.target.value.replace(/\D/g,""))} inputMode="numeric" style={inputStyle}/></Field>
          </Bloco>
          <Bloco titulo="Outras frentes missionárias">
            <Field label="Quantos interessados estão recebendo estudos Bíblicos por outras frentes missionárias?"><input type="number" min={0} value={f.estudosOutras} onChange={e=>upd("estudosOutras",e.target.value.replace(/\D/g,""))} inputMode="numeric" style={inputStyle}/></Field>
          </Bloco>
          {err && <div style={{fontSize:13,fontWeight:600,color:"#C0392B",background:"#FBEAE8",border:"1px solid #f2c9c4",borderRadius:10,padding:"9px 12px"}}>{err}</div>}
          <Btn icon={Send} onClick={enviar}>Enviar formulário</Btn>
        </div>
      </Card>
    </div>
  );
}

/* ===== Janelas de preenchimento por campanha (mês anterior, dias 01–10) ===== */
const JANELAS = { "Calebe":[12,1,10], "Semana Santa":[2,1,10], "Reencontro":[5,1,10], "Primavera":[7,1,10], "Sprint Final":[9,1,10] };
/* Exceções por ano: em 2026 o Reencontro vai até 10/jul. Anos seguintes voltam ao normal. */
const JANELAS_OVERRIDE = { "Reencontro": { 2026: { ini:[6,1], fim:[7,10] } } };
const MESEXT = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
function janelaDatas(c,y){
  const ov=(JANELAS_OVERRIDE[c]||{})[y];
  if(ov) return { inicio:new Date(y,ov.ini[0]-1,ov.ini[1],0,0,0), fim:new Date(y,ov.fim[0]-1,ov.fim[1],23,59,59), ov };
  const [m,di,df]=JANELAS[c];
  return { inicio:new Date(y,m-1,di,0,0,0), fim:new Date(y,m-1,df,23,59,59), ov:null };
}
function janelaInfo(c,y){
  y=y||new Date().getFullYear(); const ov=(JANELAS_OVERRIDE[c]||{})[y];
  if(ov) return { texto:`${String(ov.ini[1]).padStart(2,"0")} de ${MESEXT[ov.ini[0]-1]} a ${String(ov.fim[1]).padStart(2,"0")} de ${MESEXT[ov.fim[0]-1]}` };
  const [m,di,df]=JANELAS[c];
  return { texto:`${String(di).padStart(2,"0")}–${String(df).padStart(2,"0")} de ${MESEXT[m-1]}` };
}
function janelaStatus(c, now){
  const y=now.getFullYear(); const {inicio,fim}=janelaDatas(c,y); const dia=86400000;
  if(now<inicio) return {estado:"futuro", dias:Math.ceil((inicio-now)/dia)};
  if(now>fim) return {estado:"encerrado", dias:0};
  return {estado:"aberto", dias:Math.max(1,Math.ceil((fim-now)/dia))};
}
const JanelaBadge = ({st}) => {
  const map={aberto:{t:`Aberto · faltam ${st.dias}d`,bg:C.greenSoft,fg:C.green},futuro:{t:`Abre em ${st.dias}d`,bg:C.blueSoft,fg:C.blue},encerrado:{t:"Encerrado",bg:"#EEF0F2",fg:C.faint}}[st.estado];
  return <span style={{fontSize:12,fontWeight:700,color:map.fg,background:map.bg,padding:"5px 10px",borderRadius:99,whiteSpace:"nowrap"}}>{map.t}</span>;
};

/* ===== Motor de pontos ===== */
function computePontos(data, distritoId){
  const distrito=data.distritos.find(d=>d.id===distritoId);
  const igrejas=data.igrejas.filter(i=>i.distritoId===distritoId);
  const idSet=new Set(igrejas.map(i=>i.id));
  const conf=data.confirmacoes||{}, alvos=data.alvosCampanha||{};
  const itens=[]; let ganho=0;
  CAMPANHAS.forEach(c=>{
    const formsC=data.formularios.filter(f=>idSet.has(f.igrejaId)&&f.campanha===c);
    const comForm=new Set(formsC.map(f=>f.igrejaId));
    if(igrejas.length>0 && igrejas.every(ig=>comForm.has(ig.id))){ itens.push({c,label:"Preenchimento 100% das igrejas",pts:500}); ganho+=500; }
    const estC=formsC.reduce((a,f)=>a+estudosTotal(f),0);
    if(estC>=distrito.metaEstudo){ itens.push({c,label:"Meta de estudos alcançada",pts:1000}); ganho+=1000; }
    const prev=data.previsoes.find(p=>p.distritoId===distritoId&&p.campanha===c);
    const realizado=prev?Number(prev.realizado)||0:0;
    if((alvos[c]||0)>0 && realizado>=alvos[c]){ itens.push({c,label:"Alvo de batismo da campanha",pts:500}); ganho+=500; }
    if(conf[`${distritoId}:${c}:acoesBatismo`]){ itens.push({c,label:"Ações de batismo (confirmada)",pts:500}); ganho+=500; }
    if(conf[`${distritoId}:${c}:acoesEstudo`]){ itens.push({c,label:"Ações de estudo (confirmada)",pts:500}); ganho+=500; }
  });
  const gruposConf=igrejas.filter(ig=>ig.novo&&tipoDe(ig)==="grupo"&&ig.confirmadoPresidente).length;
  if(gruposConf>0){ itens.push({c:"—",label:`Novos grupos confirmados (${gruposConf})`,pts:gruposConf*500}); ganho+=gruposConf*500; }
  const realAnual=data.previsoes.filter(p=>p.distritoId===distritoId).reduce((a,p)=>a+(Number(p.realizado)||0),0);
  if(realAnual>=distrito.metaBatismo){ itens.push({c:"Ano",label:"Alvo de batismo do ano",pts:1000}); ganho+=1000; }
  const gasto=(data.resgates||[]).filter(r=>r.distritoId===distritoId).reduce((a,r)=>a+r.pontos,0);
  return { itens, ganho, gasto, saldo:ganho-gasto };
}

/* ===== Prêmios ===== */
function PremioFoto({foto,size=60}){
  const url=/^https?:\/\//.test(foto||"");
  if(url) return <img src={foto} alt="" style={{width:size,height:size,objectFit:"cover",borderRadius:12,flexShrink:0}}/>;
  return <div style={{width:size,height:size,borderRadius:12,background:C.blueSoft,display:"grid",placeItems:"center",fontSize:Math.round(size*0.5),flexShrink:0}}>{foto||"🎁"}</div>;
}
function PremioCard({pr,onRemove,onResgatar,podeResgatar}){
  return (
    <div style={{border:`1px solid ${C.line}`,borderRadius:14,padding:14,display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <PremioFoto foto={pr.foto}/>
        <div style={{minWidth:0}}>
          <div style={{fontSize:14.5,fontWeight:700,color:C.ink,overflow:"hidden",textOverflow:"ellipsis"}}>{pr.nome}</div>
          <div style={{fontSize:13,fontWeight:700,color:C.amber}}>{pr.pontos.toLocaleString("pt-BR")} pts</div>
        </div>
      </div>
      {pr.descricao&&<div style={{fontSize:12.5,color:C.muted}}>{pr.descricao}</div>}
      {onRemove&&<Btn small variant="ghost" onClick={onRemove}>Remover</Btn>}
      {onResgatar&&<Btn small variant={podeResgatar?"solid":"ghost"} onClick={podeResgatar?onResgatar:undefined}>{podeResgatar?"Resgatar":"Pontos insuficientes"}</Btn>}
    </div>
  );
}

/* ===== Presidente: Campanhas & alvos ===== */
function CampanhasPresidente({data,setData}){
  const now=new Date();
  const setAlvo=(c,v)=>setData(d=>({...d,alvosCampanha:{...(d.alvosCampanha||{}),[c]:v}}));
  return (
    <Card>
      <Eyebrow color={C.blue}>Campanhas</Eyebrow>
      <div style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:600,color:C.ink,margin:"2px 0 6px"}}>Alvos e janelas de preenchimento</div>
      <p style={{fontSize:13,color:C.muted,marginBottom:16}}>Defina o alvo de batismo de cada campanha — ele é enviado aos pastores no sistema. O preenchimento de estudos só abre na janela de cada campanha.</p>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {CAMPANHAS.map(c=>{ const st=janelaStatus(c,now); const alvo=(data.alvosCampanha||{})[c]||0; return (
          <div key={c} style={{border:`1px solid ${C.line}`,borderRadius:12,padding:14,display:"flex",flexWrap:"wrap",gap:12,alignItems:"center"}}>
            <div style={{marginRight:"auto",minWidth:170}}>
              <div style={{fontSize:14.5,fontWeight:700,color:C.blue}}>{c}</div>
              <div style={{fontSize:11.5,color:C.faint,marginTop:2}}>Campanha: {periodoCampanha(c)} · Janela: {janelaInfo(c).texto}</div>
            </div>
            <JanelaBadge st={st}/>
            <Field label="Alvo de batismo"><input type="number" min={0} value={alvo} style={{...inputStyle,width:120}} onChange={e=>setAlvo(c,Number(e.target.value))}/></Field>
          </div>); })}
      </div>
    </Card>
  );
}

/* ===== Presidente: Confirmações ===== */
function ConfirmacoesPresidente({data,setData}){
  const dById=Object.fromEntries(data.distritos.map(d=>[d.id,d]));
  const toggle=(key)=>setData(d=>({...d,confirmacoes:{...(d.confirmacoes||{}),[key]:!(d.confirmacoes||{})[key]}}));
  const confGrupo=(id,v)=>setData(d=>({...d,igrejas:d.igrejas.map(ig=>ig.id===id?{...ig,confirmadoPresidente:v}:ig)}));
  const acoes=[];
  data.previsoes.forEach(p=>{
    if(p.acoes&&p.acoes.trim()) acoes.push({distritoId:p.distritoId,campanha:p.campanha,tipo:"acoesBatismo",texto:p.acoes});
    if(p.acoesEstudo&&p.acoesEstudo.trim()) acoes.push({distritoId:p.distritoId,campanha:p.campanha,tipo:"acoesEstudo",texto:p.acoesEstudo});
  });
  const gruposPend=data.igrejas.filter(ig=>ig.novo&&tipoDe(ig)==="grupo");
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <Card>
        <Eyebrow color={C.blue}>Confirmações</Eyebrow>
        <div style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:600,color:C.ink,margin:"2px 0 6px"}}>Ações dos pastores</div>
        <p style={{fontSize:13,color:C.muted,marginBottom:14}}>Confirme cada ação para o pastor receber os 500 pontos.</p>
        {acoes.length===0? <Empty texto="Nenhuma ação enviada ainda."/> : (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {acoes.map((a,i)=>{ const key=`${a.distritoId}:${a.campanha}:${a.tipo}`; const ok=(data.confirmacoes||{})[key]; return (
              <div key={i} style={{border:`1px solid ${C.line}`,borderRadius:12,padding:14}}>
                <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                  <div style={{marginRight:"auto",minWidth:0}}>
                    <div style={{fontSize:13.5,fontWeight:700,color:C.ink}}>{dById[a.distritoId]?.nome} · {a.campanha}</div>
                    <div style={{fontSize:12,color:C.muted}}>{a.tipo==="acoesBatismo"?"Ações p/ batismos":"Ações p/ estudos"}</div>
                  </div>
                  <Btn small variant={ok?"soft":"solid"} icon={ok?Check:undefined} onClick={()=>toggle(key)}>{ok?"Confirmada (+500)":"Confirmar"}</Btn>
                </div>
                <div style={{marginTop:10,fontSize:13,color:C.ink,background:C.bg,borderRadius:8,padding:"8px 10px"}}>{a.texto}</div>
              </div>); })}
          </div>
        )}
      </Card>
      <Card>
        <div style={{fontFamily:"Sora,sans-serif",fontSize:16,fontWeight:600,color:C.ink,marginBottom:6}}>Novos grupos cadastrados</div>
        <p style={{fontSize:13,color:C.muted,marginBottom:14}}>Confirme para liberar 500 pontos ao pastor.</p>
        {gruposPend.length===0? <Empty texto="Nenhum grupo novo cadastrado."/> : (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {gruposPend.map(ig=>(<div key={ig.id} style={{display:"flex",alignItems:"center",gap:10,border:`1px solid ${C.line}`,borderRadius:10,padding:"10px 12px"}}>
              <Building2 size={16} color={C.amber}/><span style={{fontSize:14,fontWeight:600,color:C.ink,marginRight:"auto",minWidth:0}}>{ig.nome} <span style={{color:C.faint,fontWeight:400}}>· {dById[ig.distritoId]?.nome}</span></span>
              <Btn small variant={ig.confirmadoPresidente?"soft":"solid"} icon={ig.confirmadoPresidente?Check:undefined} onClick={()=>confGrupo(ig.id,!ig.confirmadoPresidente)}>{ig.confirmadoPresidente?"Confirmado (+500)":"Confirmar"}</Btn>
            </div>))}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ===== Presidente: Prêmios ===== */
function PremiosPresidente({data,setData}){
  const [nome,setNome]=useState(""); const [pontos,setPontos]=useState(""); const [foto,setFoto]=useState(""); const [desc,setDesc]=useState("");
  const premios=data.premios||[];
  function add(){ if(!nome.trim()||!pontos)return; setData(d=>({...d,premios:[...(d.premios||[]),{id:"pr"+Date.now(),nome:nome.trim(),pontos:Number(pontos),foto:foto.trim(),descricao:desc.trim()}]})); setNome("");setPontos("");setFoto("");setDesc(""); }
  const rem=(id)=>setData(d=>({...d,premios:(d.premios||[]).filter(p=>p.id!==id)}));
  return (
    <Card>
      <Eyebrow color={C.blue}>Prêmios</Eyebrow>
      <div style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:600,color:C.ink,margin:"2px 0 6px"}}>Loja de pontos</div>
      <p style={{fontSize:13,color:C.muted,marginBottom:16}}>Cadastre os prêmios que os pastores poderão resgatar com pontos. Use um emoji ou o link de uma foto.</p>
      <div style={{display:"grid",gap:12,gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",alignItems:"end"}}>
        <Field label="Nome do prêmio"><input value={nome} onChange={e=>setNome(e.target.value)} style={inputStyle} placeholder="Ex.: Vale-livro"/></Field>
        <Field label="Pontos"><input type="number" min={0} value={pontos} onChange={e=>setPontos(e.target.value)} style={inputStyle}/></Field>
        <Field label="Foto (emoji ou URL)"><input value={foto} onChange={e=>setFoto(e.target.value)} style={inputStyle} placeholder="🎁 ou https://…"/></Field>
        <Field label="Descrição"><input value={desc} onChange={e=>setDesc(e.target.value)} style={inputStyle} placeholder="Opcional"/></Field>
      </div>
      <div style={{marginTop:12}}><Btn icon={Plus} onClick={add}>Adicionar prêmio</Btn></div>
      <div style={{marginTop:18,display:"grid",gap:12,gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))"}}>
        {premios.length===0? <Empty texto="Nenhum prêmio cadastrado."/> : premios.map(pr=><PremioCard key={pr.id} pr={pr} onRemove={()=>rem(pr.id)}/>)}
      </div>
    </Card>
  );
}

/* ===== Presidente: Gestão (lotação de pastores e virada de ciclo) ===== */
function GestaoPresidente({data,setData}){
  const [novo,setNovo]=useState(""); const [confirmar,setConfirmar]=useState(false);
  const pastores=data.pastores||[];
  const reassign=(distritoId,pastorId)=>setData(d=>({...d,distritos:d.distritos.map(dd=>dd.id===distritoId?{...dd,pastorId,pastor:(d.pastores.find(p=>p.id===pastorId)||{}).nome||dd.pastor}:dd)}));
  function addPastor(){ const nome=novo.trim(); if(!nome)return; setData(d=>{ if((d.pastores||[]).some(p=>p.nome.toLowerCase()===nome.toLowerCase()))return d; return {...d,pastores:[...(d.pastores||[]),{id:"pa"+Date.now(),nome}]}; }); setNovo(""); }
  const setDepto=(regiaoId,nome)=>setData(d=>({...d,regioes:d.regioes.map(r=>r.id===regiaoId?{...r,departamental:nome}:r)}));
  function encerrarCiclo(){
    setData(d=>{
      const ano=d.anoAtivo;
      const lotacoes=d.distritos.map(dd=>{
        const ids=new Set(d.igrejas.filter(i=>i.distritoId===dd.id).map(i=>i.id));
        const bat=d.batismos.filter(b=>ids.has(b.ig)).reduce((a,b)=>a+b.bat+b.reb,0);
        const ganho=computePontos(d,dd.id).ganho;
        return {distritoId:dd.id,distrito:dd.nome,pastor:dd.pastor,alvo:dd.metaBatismo,batismos:bat,pontos:ganho};
      });
      const pontosBanco={...(d.pontosBanco||{})};
      lotacoes.forEach(l=>{ pontosBanco[l.distritoId]=(pontosBanco[l.distritoId]||0)+l.pontos; });
      const previsoes=[]; d.distritos.forEach(dd=>CAMPANHAS.forEach(c=>previsoes.push({distritoId:dd.id,campanha:c,previsto:20,realizado:0,acoes:"",acoesEstudo:""})));
      return {...d, anoAtivo:ano+1, historicoGestao:[...(d.historicoGestao||[]),{ano,lotacoes}], pontosBanco, previsoes, formularios:[], confirmacoes:{}, alvosCampanha:{}};
    });
    setConfirmar(false);
  }
  const hist=(data.historicoGestao||[]).slice().reverse();
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <Card style={{display:"flex",flexWrap:"wrap",gap:12,alignItems:"center"}}>
        <div style={{marginRight:"auto"}}>
          <Eyebrow color={C.blue}>Gestão</Eyebrow>
          <div style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:600,color:C.ink,marginTop:2}}>Lotação dos pastores · {data.anoAtivo}</div>
        </div>
        <Btn variant={confirmar?"solid":"ghost"} onClick={()=>confirmar?encerrarCiclo():setConfirmar(true)}>{confirmar?`Confirmar encerramento de ${data.anoAtivo}`:`Encerrar ${data.anoAtivo} e abrir ${data.anoAtivo+1}`}</Btn>
      </Card>
      <Note>Trocar o pastor de um distrito não apaga nada: batismos, estudos e pontos pertencem ao distrito. Ao encerrar o ciclo, a lotação e os resultados do ano são arquivados no histórico, o novo ano começa zerado e os pontos do ano são depositados no distrito (o próximo pastor herda).</Note>
      <Card>
        <div style={{fontFamily:"Sora,sans-serif",fontSize:15,fontWeight:600,color:C.ink,marginBottom:12}}>Departamentais por região</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {data.regioes.map(r=>(
            <div key={r.id} style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{flex:1,fontSize:13.5,fontWeight:600,color:C.ink,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.nome}</span>
              <input value={r.departamental||""} onChange={e=>setDepto(r.id,e.target.value)} style={{...inputStyle,maxWidth:240,padding:"7px 10px",fontSize:13}} placeholder="Nome do departamental"/>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div style={{display:"flex",flexWrap:"wrap",gap:10,alignItems:"flex-end",marginBottom:14}}>
          <div style={{fontFamily:"Sora,sans-serif",fontSize:15,fontWeight:600,color:C.ink,marginRight:"auto"}}>Pastores ({pastores.length})</div>
          <Field label="Adicionar pastor"><input value={novo} onChange={e=>setNovo(e.target.value)} style={{...inputStyle,minWidth:200}} placeholder="Nome do novo pastor"/></Field>
          <Btn icon={Plus} onClick={addPastor}>Adicionar</Btn>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:520,overflowY:"auto"}}>
          {data.regioes.map(r=>(
            <div key={r.id}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",color:C.faint,textTransform:"uppercase",margin:"10px 0 4px"}}>{r.nome}</div>
              {data.distritos.filter(dd=>dd.regiaoId===r.id).map(dd=>(
                <div key={dd.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.line}`}}>
                  <span style={{flex:1,fontSize:14,fontWeight:600,color:C.ink,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{dd.nome}</span>
                  <Select value={dd.pastorId||""} onChange={e=>reassign(dd.id,e.target.value)} style={{...inputStyle,maxWidth:230,padding:"7px 9px",fontSize:13}}>
                    {pastores.map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}
                  </Select>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>
      {hist.length>0 && (
        <Card>
          <div style={{fontFamily:"Sora,sans-serif",fontSize:15,fontWeight:600,color:C.ink,marginBottom:10}}>Histórico de gestões</div>
          {hist.map(h=>(
            <details key={h.ano} style={{borderTop:`1px solid ${C.line}`,padding:"10px 0"}}>
              <summary style={{cursor:"pointer",fontSize:14,fontWeight:600,color:C.blue}}>Gestão {h.ano} — {h.lotacoes.length} distritos</summary>
              <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:2}}>
                {h.lotacoes.map(l=>(<div key={l.distritoId} style={{display:"flex",justifyContent:"space-between",gap:10,fontSize:12.5,color:C.muted,padding:"3px 0"}}><span style={{minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.distrito} · {l.pastor}</span><span style={{whiteSpace:"nowrap"}}>{l.batismos} bat · {l.pontos} pts</span></div>))}
              </div>
            </details>
          ))}
        </Card>
      )}
    </div>
  );
}

/* ===== Presidente: wrapper com sub-abas ===== */
/* ===== Desenvolvedor: igrejas/grupos ===== */
function IgrejasDev({data,setData}){
  const [regiaoId,setRegiaoId]=useState("");
  const [distritoId,setDistritoId]=useState("");
  const [nome,setNome]=useState("");
  const [tipo,setTipo]=useState("igreja");
  const distritosVis=data.distritos.filter(d=>!regiaoId||d.regiaoId===regiaoId);
  const igrejasDist=distritoId?data.igrejas.filter(i=>i.distritoId===distritoId):[];
  const add=()=>{ if(!distritoId||!nome.trim())return; const novo={id:"ig"+Date.now(),nome:nome.trim(),distritoId,tipo,novo:true}; setData(d=>({...d,igrejas:[...d.igrejas,novo]})); setNome(""); };
  const remover=(id)=>setData(d=>({...d,igrejas:d.igrejas.filter(i=>i.id!==id)}));
  const mudarTipo=(id,t)=>setData(d=>({...d,igrejas:d.igrejas.map(i=>i.id===id?{...i,tipo:t}:i)}));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <Card>
        <div style={{fontFamily:"Sora,sans-serif",fontSize:16,fontWeight:600,color:C.ink,marginBottom:4}}>Adicionar igreja ou grupo</div>
        <p style={{fontSize:13,color:C.muted,marginBottom:14}}>Escolha a região e o distrito. A congregação entra automaticamente no sistema, aparecendo para o distrital e nos rankings.</p>
        <div style={{display:"grid",gap:12,gridTemplateColumns:"repeat(auto-fit, minmax(160px,1fr))"}}>
          <Field label="Região"><Select value={regiaoId} onChange={e=>{setRegiaoId(e.target.value);setDistritoId("");}}><option value="">Selecione…</option>{data.regioes.map(r=><option key={r.id} value={r.id}>{r.nome}</option>)}</Select></Field>
          <Field label="Distrito"><Select value={distritoId} onChange={e=>setDistritoId(e.target.value)}><option value="">Selecione…</option>{distritosVis.map(d=><option key={d.id} value={d.id}>{d.nome}</option>)}</Select></Field>
          <Field label="Nome"><input value={nome} placeholder="Nome da igreja/grupo" style={inputStyle} onChange={e=>setNome(e.target.value)}/></Field>
          <Field label="Tipo"><Select value={tipo} onChange={e=>setTipo(e.target.value)}><option value="igreja">Igreja</option><option value="grupo">Grupo</option></Select></Field>
        </div>
        <div style={{marginTop:14}}><Btn icon={Plus} onClick={add} disabled={!distritoId||!nome.trim()}>Adicionar ao distrito</Btn></div>
      </Card>
      {distritoId && (
        <Card>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><Building2 size={17} color={C.blue}/><div style={{fontFamily:"Sora,sans-serif",fontSize:15,fontWeight:600,color:C.ink}}>{data.distritos.find(d=>d.id===distritoId)?.nome} — {igrejasDist.length} congregações</div></div>
          <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:420,overflowY:"auto"}}>
            {igrejasDist.map(ig=>(
              <div key={ig.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.line}`}}>
                <span style={{flex:1,minWidth:0,fontSize:14,color:C.ink,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ig.nome}</span>
                {ig.novo && <span style={{fontSize:10.5,fontWeight:700,color:C.amber,background:C.amberSoft,borderRadius:99,padding:"2px 8px"}}>NOVO</span>
                }
                <Select value={tipoDe(ig)} onChange={e=>mudarTipo(ig.id,e.target.value)} style={{padding:"5px 8px",fontSize:12.5,minWidth:0,width:96}}><option value="igreja">Igreja</option><option value="grupo">Grupo</option></Select>
                <button onClick={()=>remover(ig.id)} style={{border:`1px solid ${C.line}`,background:"#fff",color:C.muted,borderRadius:8,padding:"5px 10px",fontSize:12.5,fontWeight:600,cursor:"pointer"}}>Remover</button>
              </div>))}
          </div>
        </Card>
      )}
    </div>
  );
}

/* ===== Desenvolvedor: batismos por PDF (ACMS) ===== */
function RealizadoDev({data,setData}){
  const [arquivo,setArquivo]=useState(null);
  const batDistrito=(distId)=>{ const ids=new Set(data.igrejas.filter(i=>i.distritoId===distId).map(i=>i.id)); return batCells(data,ids).reduce((a,b)=>a+bapt(b),0); };
  const importar=(file)=>{ setArquivo(file.name); /* Em produção: o PDF do ACMS traz os batismos por igreja e o sistema atualiza data.batismos. Aqui é demonstração. */ };
  const totalGeral=data.batismos.reduce((a,b)=>a+bapt(b),0);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <Card>
        <div style={{fontFamily:"Sora,sans-serif",fontSize:16,fontWeight:600,color:C.ink,marginBottom:4}}>Batismos — relatório do ACMS</div>
        <p style={{fontSize:13,color:C.muted,marginBottom:14}}>Envie o PDF do ACMS com todos os batismos por igreja. O sistema faz a <strong>atualização geral</strong>: batismos, rankings e painéis de todos os distritos são recalculados automaticamente.</p>
        <label style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 16px",borderRadius:10,border:`1px dashed ${C.blue}`,background:C.blueSoft,color:C.blue,fontWeight:600,fontSize:13.5,cursor:"pointer"}}>
          <Send size={16}/> Enviar PDF do ACMS
          <input type="file" accept="application/pdf" style={{display:"none"}} onChange={e=>{ const f=e.target.files&&e.target.files[0]; if(f) importar(f); e.target.value=""; }}/>
        </label>
        {arquivo && <div style={{marginTop:10,fontSize:12.5,color:C.green,fontWeight:600,display:"inline-flex",alignItems:"center",gap:6}}><Check size={15}/> {arquivo} recebido — atualização geral concluída (demonstração).</div>}
      </Card>
      <Card>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><Droplets size={17} color={C.blue}/><div><Eyebrow color={C.blue}>Batismos por distrito</Eyebrow><div style={{fontFamily:"Sora,sans-serif",fontSize:15,fontWeight:600,color:C.ink,marginTop:1}}>Total geral: {totalGeral}</div></div></div>
        <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:520,overflowY:"auto"}}>
          {data.distritos.map(d=>(
            <div key={d.id} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:`1px solid ${C.line}`}}>
              <span style={{flex:1,minWidth:0,fontSize:13.5,color:C.ink,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.nome}</span>
              <span style={{fontSize:13.5,fontWeight:700,color:C.blueDark}}>{batDistrito(d.id)}</span>
              <span style={{fontSize:11.5,color:C.faint}}>de {d.metaBatismo}</span>
            </div>))}
        </div>
      </Card>
    </div>
  );
}

/* ============ HUB DESENVOLVEDOR / PRESIDÊNCIA ============ */
function PresidenteView({data,setData,filtros,setFiltros,mostrarAcessos=true}){
  const [sub,setSub]=useState("painel");
  const tabs=[{id:"painel",label:"Painel",icon:TrendingUp},{id:"ranking",label:"Ranking",icon:BarChart3},{id:"realizado",label:"Batismos (PDF)",icon:Droplets},{id:"sorteio",label:"Sorteio",icon:Gift},{id:"igrejas",label:"Igrejas e grupos",icon:Building2},{id:"gestao",label:"Gestão",icon:UserCog},{id:"acessos",label:"Acessos",icon:UserPlus}].filter(t=>t.id!=="acessos"||mostrarAcessos);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div className="tabscroll" style={{display:"flex",gap:8,overflowX:"auto",flexWrap:"nowrap",paddingBottom:2,marginBottom:4,WebkitOverflowScrolling:"touch"}}>
        {tabs.map(t=>(<button key={t.id} onClick={()=>setSub(t.id)} style={{flexShrink:0,whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:7,padding:"9px 14px",borderRadius:10,cursor:"pointer",fontSize:13.5,fontWeight:600,border:`1px solid ${sub===t.id?C.blueDark:C.line}`,background:sub===t.id?C.grad:"#fff",color:sub===t.id?"#fff":C.muted,boxShadow:sub===t.id?"0 4px 12px rgba(14,58,102,.18)":"none"}}><t.icon size={15}/>{t.label}</button>))}
      </div>
      {sub==="painel"&&<PainelLideranca data={data} filtros={filtros} setFiltros={setFiltros} vista="painel"/>}
      {sub==="ranking"&&<PainelLideranca data={data} filtros={filtros} setFiltros={setFiltros} vista="ranking"/>}
      {sub==="realizado"&&<RealizadoDev data={data} setData={setData}/>}
      {sub==="sorteio"&&<SorteioDev data={data} setData={setData}/>}
      {sub==="igrejas"&&<IgrejasDev data={data} setData={setData}/>}
      {sub==="gestao"&&<GestaoPresidente data={data} setData={setData}/>}
      {sub==="acessos"&&mostrarAcessos&&<AcessosPresidente data={data} setData={setData}/>}
    </div>
  );
}

/* ===== Pastor: Pontos & prêmios ===== */
/* ===== Sorteio de premiação ===== */
function formsCompletos(data, distritoId, mes, ano){
  const igs = data.igrejas.filter(i=>i.distritoId===distritoId);
  const feitos = igs.filter(ig => (data.formularios||[]).some(f=>f.igrejaId===ig.id && f.mes===mes && f.ano===ano)).length;
  return { feitos, total: igs.length, completo: igs.length>0 && feitos===igs.length };
}

function PremiacaoPastor({data, distritoId}){
  const now=new Date(); const mes=now.getMonth()+1, ano=now.getFullYear();
  const nomeMes=MESEXT[mes-1].charAt(0).toUpperCase()+MESEXT[mes-1].slice(1);
  const { feitos, total, completo } = formsCompletos(data, distritoId, mes, ano);
  const faltam = Math.max(0, total-feitos);
  const ganhou = (data.sorteios||[]).some(s=>s.ano===ano && s.mes===mes && s.ganhadorDistritoId===distritoId);
  const sorteioMes = (data.sorteios||[]).find(s=>s.ano===ano && s.mes===mes);
  const igsPend = data.igrejas.filter(i=>i.distritoId===distritoId && !(data.formularios||[]).some(f=>f.igrejaId===i.id && f.mes===mes && f.ano===ano));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <Card style={{background:completo?C.greenSoft:C.amberSoft,border:`1px solid ${completo?"#cde8d6":"#f0e0c0"}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <div style={{width:40,height:40,borderRadius:12,background:"#fff",display:"grid",placeItems:"center"}}>{completo?<Check size={22} color={C.green}/>:<Gift size={22} color={C.amber}/>}</div>
          <div><Eyebrow color={completo?C.green:C.amber}>Sorteio · {nomeMes}</Eyebrow><div style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:700,color:C.ink,marginTop:1}}>{completo?"Você está no sorteio! 🎉":`Faltam ${faltam} formulário${faltam===1?"":"s"}`}</div></div>
        </div>
        <p style={{fontSize:13,color:C.muted,marginBottom:12}}>Entra no sorteio quem preencher <strong>todos</strong> os formulários de estudos das congregações no mês. O sorteio acontece no dia 16 de cada mês.</p>
        <Progress value={feitos} goal={total||1} tint={completo?C.green:C.amber}/>
        <div style={{fontSize:12.5,color:C.muted,marginTop:8}}>{feitos} de {total} congregações preencheram em {nomeMes}.</div>
      </Card>

      {data.premioSorteio ? (
        <Card style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:12,background:C.blueSoft,display:"grid",placeItems:"center",flexShrink:0}}><Gift size={22} color={C.blue}/></div>
          <div><Eyebrow color={C.blue}>Prêmio em disputa</Eyebrow><div style={{fontSize:15,fontWeight:700,color:C.ink,marginTop:2}}>{data.premioSorteio}</div></div>
        </Card>
      ) : null}

      {sorteioMes && (
        <Card style={{background:ganhou?C.grad:"#fff",border:ganhou?"none":`1px solid ${C.line}`,color:ganhou?"#fff":C.ink,textAlign:"center",padding:24}}>
          <div style={{fontSize:ganhou?34:28}}>{ganhou?"🏆":"🎉"}</div>
          <div style={{fontSize:11,letterSpacing:".12em",opacity:.75,marginTop:4}}>RESULTADO DO SORTEIO · {nomeMes.toUpperCase()}</div>
          <div style={{fontFamily:"Sora,sans-serif",fontSize:20,fontWeight:700,marginTop:2}}>{ganhou?"Seu distrito foi sorteado!":sorteioMes.ganhadorNome}</div>
          {sorteioMes.premio && <div style={{fontSize:13,marginTop:4,color:ganhou?"#fff":C.muted,opacity:ganhou?.9:1}}>Prêmio: {sorteioMes.premio}</div>}
          {ganhou && <div style={{fontSize:13,opacity:.85,marginTop:4}}>Parabéns pela mobilização da equipe.</div>}
        </Card>
      )}

      {!completo && igsPend.length>0 && (
        <Card>
          <Eyebrow color={C.amber}>Faltam preencher em {nomeMes}</Eyebrow>
          <div style={{display:"flex",flexDirection:"column",gap:7,marginTop:10,maxHeight:320,overflowY:"auto"}}>
            {igsPend.map(ig=>(<div key={ig.id} style={{display:"flex",alignItems:"center",gap:8,fontSize:13.5,color:C.ink,paddingBottom:7,borderBottom:`1px solid ${C.line}`}}><span style={{flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ig.nome}</span><TipoTag tipo={tipoDe(ig)}/></div>))}
          </div>
        </Card>
      )}
    </div>
  );
}

function SorteioDev({data, setData}){
  const now=new Date();
  const ano=now.getFullYear();
  const [mes,setMes]=useState(now.getMonth()+1);
  const [premio,setPremio]=useState(data.premioSorteio||"");
  const [resultado,setResultado]=useState(null);
  const [aviso,setAviso]=useState("");
  const cap=(s)=>s.charAt(0).toUpperCase()+s.slice(1);
  const nomeMes=cap(MESEXT[mes-1]);
  const linhas = data.distritos.map(d=>({d, ...formsCompletos(data,d.id,mes,ano)})).sort((a,b)=>(b.completo-a.completo)||(b.feitos-a.feitos));
  const elegiveis = linhas.filter(l=>l.completo);
  const jaGanharam = new Set((data.sorteios||[]).filter(s=>s.ano===ano).map(s=>s.ganhadorDistritoId));
  const pool = elegiveis.filter(l=>!jaGanharam.has(l.d.id));
  const salvarPremio=(v)=>{ setPremio(v); setData(x=>({...x,premioSorteio:v})); };
  const sortear=()=>{
    setResultado(null); setAviso("");
    if(elegiveis.length===0){ setAviso("Nenhum distrito elegível neste mês."); return; }
    if(pool.length===0){ setAviso("Todos os elegíveis deste mês já foram sorteados neste ano."); return; }
    const venc=pool[Math.floor(Math.random()*pool.length)].d;
    const reg={ id:"srt"+Date.now(), mes, ano, premio, ganhadorDistritoId:venc.id, ganhadorNome:venc.nome, data:new Date().toISOString() };
    setResultado(reg);
    setData(x=>({...x, premioSorteio:premio, sorteios:[reg,...(x.sorteios||[])]}));
  };
  const historico=(data.sorteios||[]).filter(s=>s.ano===ano && s.mes===mes);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <Card>
        <div style={{fontFamily:"Sora,sans-serif",fontSize:16,fontWeight:600,color:C.ink,marginBottom:4}}>Sorteio de prêmio — {nomeMes}</div>
        <p style={{fontSize:13,color:C.muted,marginBottom:14}}>Entram os distritos que preencheram <strong>todos</strong> os formulários de estudos no mês. Sorteio previsto para o dia 16.</p>
        <div style={{display:"grid",gap:12,gridTemplateColumns:"repeat(auto-fit, minmax(160px,1fr))",marginBottom:14}}>
          <Field label="Mês"><Select value={mes} onChange={e=>{setMes(Number(e.target.value));setResultado(null);setAviso("");}}>{MESEXT.map((m,i)=><option key={i} value={i+1}>{cap(m)}</option>)}</Select></Field>
          <Field label="Prêmio"><input value={premio} placeholder="Ex.: voucher, kit, diária…" style={inputStyle} onChange={e=>salvarPremio(e.target.value)}/></Field>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <span style={{fontSize:13,color:C.muted}}><strong style={{color:C.ink}}>{elegiveis.length}</strong> de {data.distritos.length} distritos elegíveis</span>
          <button onClick={sortear} disabled={elegiveis.length===0} style={{marginLeft:"auto",display:"inline-flex",alignItems:"center",gap:8,padding:"10px 18px",borderRadius:10,border:"none",cursor:elegiveis.length?"pointer":"not-allowed",fontSize:14,fontWeight:700,color:"#fff",background:elegiveis.length?C.grad:C.faint,boxShadow:elegiveis.length?"0 4px 12px rgba(14,58,102,.2)":"none"}}><Shuffle size={17}/> Sortear</button>
        </div>
        {aviso && <div style={{marginTop:12,fontSize:13,color:C.amber,fontWeight:600}}>{aviso}</div>}
        {resultado && (
          <div style={{marginTop:16,background:C.grad,borderRadius:14,padding:22,color:"#fff",textAlign:"center"}}>
            <div style={{fontSize:32}}>🎉</div>
            <div style={{fontSize:11,letterSpacing:".12em",opacity:.8,marginTop:4}}>DISTRITO SORTEADO · {nomeMes.toUpperCase()}</div>
            <div style={{fontFamily:"Sora,sans-serif",fontSize:22,fontWeight:700,marginTop:2}}>{resultado.ganhadorNome}</div>
            {resultado.premio && <div style={{fontSize:13.5,opacity:.9,marginTop:4}}>Prêmio: {resultado.premio}</div>}
          </div>
        )}
      </Card>

      <Card>
        <Eyebrow color={C.blue}>Status dos distritos · {nomeMes}</Eyebrow>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:10,maxHeight:420,overflowY:"auto"}}>
          {linhas.map(({d,feitos,total,completo})=>(
            <div key={d.id} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:`1px solid ${C.line}`}}>
              <span style={{flex:1,minWidth:0,fontSize:13.5,color:C.ink,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.nome}</span>
              <span style={{fontSize:12.5,color:C.muted}}>{feitos}/{total}</span>
              {completo
                ? <span style={{fontSize:11,fontWeight:700,color:C.green,background:C.greenSoft,borderRadius:99,padding:"3px 9px"}}>ELEGÍVEL</span>
                : <span style={{fontSize:11,fontWeight:600,color:C.faint,background:C.bg,borderRadius:99,padding:"3px 9px"}}>—</span>}
            </div>))}
        </div>
      </Card>

      {historico.length>0 && (
        <Card>
          <Eyebrow color={C.blue}>Sorteios de {nomeMes}</Eyebrow>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:10}}>
            {historico.map(s=>(<div key={s.id} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:`1px solid ${C.line}`}}><Gift size={15} color={C.amber}/><span style={{flex:1,minWidth:0,fontSize:13.5,color:C.ink,fontWeight:600}}>{s.ganhadorNome}</span>{s.premio&&<span style={{fontSize:12,color:C.muted}}>{s.premio}</span>}<span style={{fontSize:11.5,color:C.faint}}>{new Date(s.data).toLocaleDateString("pt-BR")}</span></div>))}
          </div>
        </Card>
      )}
    </div>
  );
}

function PontosPastor({data,setData,distritoId}){
  const { itens, ganho, gasto } = computePontos(data, distritoId);
  const banco = (data.pontosBanco||{})[distritoId]||0;
  const ganhoTotal = banco + ganho;
  const saldo = ganhoTotal - gasto;
  const premios=data.premios||[]; const alvos=data.alvosCampanha||{}; const conf=data.confirmacoes||{};
  const resgates=(data.resgates||[]).filter(r=>r.distritoId===distritoId);
  const resgatar=(pr)=>{ if(saldo<pr.pontos)return; setData(d=>({...d,resgates:[...(d.resgates||[]),{id:"rs"+Date.now(),distritoId,premioId:pr.id,nome:pr.nome,pontos:pr.pontos,data:new Date().toISOString().slice(0,10)}]})); };
  const setAcao=(c,campo,val)=>setData(d=>({...d,previsoes:d.previsoes.map(p=>p.distritoId===distritoId&&p.campanha===c?{...p,[campo]:val}:p)}));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <Card style={{background:C.blue,border:"none",color:"#fff",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
        <Trophy size={26}/>
        <div><div style={{fontSize:11,opacity:.8,letterSpacing:".12em"}}>SALDO DE PONTOS</div><div style={{fontFamily:"Sora,sans-serif",fontSize:30,fontWeight:700}}>{saldo.toLocaleString("pt-BR")}</div></div>
        <div style={{marginLeft:"auto",fontSize:12.5,opacity:.9,textAlign:"right",lineHeight:1.5}}>Ganhos: {ganhoTotal.toLocaleString("pt-BR")}<br/>Gastos: {gasto.toLocaleString("pt-BR")}</div>
      </Card>

      <Card>
        <Eyebrow color={C.blue}>Alvo da campanha (presidência)</Eyebrow>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:10}}>
          {(()=>{ const campAtual=campanhaDoMes(new Date().getMonth()+1); return CAMPANHAS.filter(c=>c===campAtual).map(c=>(<span key={c} style={{fontSize:13,fontWeight:700,color:C.ink,background:C.blueSoft,borderRadius:99,padding:"7px 14px"}}>{c}: {(alvos[c]||0)>0?`${alvos[c]} batismos`:"a definir"}</span>)); })()}
        </div>
      </Card>

      <Card>
        <div style={{fontFamily:"Sora,sans-serif",fontSize:16,fontWeight:600,color:C.ink,marginBottom:8}}>Pontos conquistados</div>
        {banco>0 && <div style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:`1px solid ${C.line}`}}><Trophy size={15} color={C.blue}/><span style={{flex:1,fontSize:13.5,color:C.ink}}>Acumulado de gestões anteriores (no distrito)</span><span style={{fontSize:13.5,fontWeight:700,color:C.amber}}>+{banco.toLocaleString("pt-BR")}</span></div>}
        {itens.length===0? <Empty texto="Ainda sem pontos. Complete preenchimentos, metas e ações."/> : (
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {itens.map((it,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<itens.length-1?`1px solid ${C.line}`:"none"}}>
              <Check size={15} color={C.green}/><span style={{flex:1,fontSize:13.5,color:C.ink}}>{it.label}{it.c&&it.c!=="—"&&it.c!=="Ano"?<span style={{color:C.faint}}> · {it.c}</span>:null}</span><span style={{fontSize:13.5,fontWeight:700,color:C.amber}}>+{it.pts}</span>
            </div>))}
          </div>
        )}
      </Card>

      <Card>
        <div style={{fontFamily:"Sora,sans-serif",fontSize:16,fontWeight:600,color:C.ink,marginBottom:10}}>Trocar pontos por prêmios</div>
        {premios.length===0? <Empty texto="A presidência ainda não cadastrou prêmios."/> : (
          <div style={{display:"grid",gap:12,gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))"}}>
            {premios.map(pr=><PremioCard key={pr.id} pr={pr} onResgatar={()=>resgatar(pr)} podeResgatar={saldo>=pr.pontos}/>)}
          </div>
        )}
        {resgates.length>0&&(<div style={{marginTop:16}}>
          <div style={{fontSize:12.5,fontWeight:700,color:C.muted,marginBottom:8}}>Resgates</div>
          {resgates.map(r=>(<div key={r.id} style={{display:"flex",justifyContent:"space-between",fontSize:13,color:C.ink,padding:"6px 0",borderBottom:`1px solid ${C.line}`}}><span>{r.nome}</span><span style={{color:C.amber,fontWeight:700}}>−{r.pontos} · {r.data}</span></div>))}
        </div>)}
      </Card>
    </div>
  );
}

/* ---------- selo CRM (logo oficial) ---------- */
const LOGO_OFICIAL = "data:image/jpeg;base64,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";
function SeloCRM({size=44}){
  return <img src={LOGO_OFICIAL} alt="Selo Projeto 200" width={size} height={size} style={{borderRadius:"50%",objectFit:"cover",display:"block",flexShrink:0}}/>;
}
const ContextoBar = ({icon:Icon,texto,children}) => (
  <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:12,marginBottom:18,background:C.blueSoft,border:`1px solid ${C.line}`,borderRadius:12,padding:"10px 14px"}}>
    <Icon size={17} color={C.blue}/><span style={{fontSize:13.5,fontWeight:600,color:C.blue,marginRight:"auto"}}>{texto}</span>{children}
  </div>
);

/* ===== Feed: quem preencheu (escopo por papel) ===== */
function FeedPreenchimentos({data,regiaoId,distritoId,todos,campanha}){
  const Q=useMemo(()=>makeQueries(data),[data]);
  const dById=useMemo(()=>Object.fromEntries(data.distritos.map(d=>[d.id,d])),[data]);
  const rById=useMemo(()=>Object.fromEntries(data.regioes.map(r=>[r.id,r])),[data]);
  let forms=(data.formularios||[]).filter(f=>{ const ig=Q.igById[f.igrejaId]; if(!ig)return false; if(campanha&&campanha!=="Todas"&&f.campanha!==campanha)return false; const dist=dById[ig.distritoId]; if(distritoId) return ig.distritoId===distritoId; if(regiaoId) return dist&&dist.regiaoId===regiaoId; return true; });
  forms=forms.slice().sort((a,b)=>(String(b.data||"")).localeCompare(String(a.data||""))||String(b.id).localeCompare(String(a.id)));
  return (
    <Card style={{marginBottom:18}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:forms.length?12:0}}>
        <ClipboardList size={17} color={C.blue}/>
        <div style={{fontFamily:"Sora,sans-serif",fontSize:15,fontWeight:600,color:C.ink}}>Preenchimentos recebidos</div>
        <span style={{marginLeft:"auto",fontSize:12,fontWeight:700,color:C.blue,background:C.blueSoft,padding:"3px 9px",borderRadius:99}}>{forms.length}</span>
      </div>
      {forms.length===0 ? <div style={{fontSize:13,color:C.faint}}>Nenhum preenchimento recebido ainda. Quando os líderes enviarem o formulário, aparece aqui.</div> : (
        <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:340,overflowY:"auto"}}>
          {forms.slice(0,30).map(f=>{ const ig=Q.igById[f.igrejaId]; const dist=dById[ig.distritoId]; const reg=rById[dist&&dist.regiaoId]; const est=estudosTotal(f); return (
            <div key={f.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.line}`}}>
              <div style={{width:30,height:30,borderRadius:8,background:C.greenSoft,display:"grid",placeItems:"center",flexShrink:0}}><Check size={15} color={C.green}/></div>
              <div style={{minWidth:0,flex:1}}>
                <div style={{fontSize:13.5,fontWeight:700,color:C.ink,display:"flex",alignItems:"center",gap:6}}><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ig.nome}</span><TipoTag tipo={tipoDe(ig)}/></div>
                <div style={{fontSize:12,color:C.muted,marginTop:1}}>{f.mes?MES[f.mes-1]:(f.campanha||"")} · {est} estudos{!distritoId&&dist?` · ${dist.nome}`:""}{todos&&reg?` · ${reg.nome}`:""}</div>
              </div>
              <div style={{fontSize:11.5,color:C.faint,whiteSpace:"nowrap"}}>{f.data}</div>
            </div>); })}
        </div>
      )}
    </Card>
  );
}

/* ===== Visão: Distritos (somente leitura) ===== */
function DistritosView({data, filtros, setFiltros, lockRegiaoId}){
  const regiaoId = lockRegiaoId||(filtros&&filtros.regiaoId)||"";
  const distritos = data.distritos.filter(d=>(!regiaoId||d.regiaoId===regiaoId)&&(!(filtros&&filtros.distritoId)||d.id===filtros.distritoId));
  const rById = Object.fromEntries(data.regioes.map(r=>[r.id,r]));
  const rows = distritos.map(d=>{
    const ids=new Set(data.igrejas.filter(i=>i.distritoId===d.id).map(i=>i.id));
    const bat=batCells(data,ids).reduce((a,b)=>a+bapt(b),0);
    const est=data.formularios.filter(f=>ids.has(f.igrejaId)).reduce((a,f)=>a+estudosTotal(f),0);
    return {d,bat,est,nIg:ids.size,pct:d.metaBatismo?Math.round(bat/d.metaBatismo*100):0};
  }).sort((a,b)=>b.bat-a.bat);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <BarraFiltros data={data} filtros={filtros} setFiltros={setFiltros} lockRegiaoId={lockRegiaoId}/>
      <Card>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><Map size={18} color={C.blue}/><div><Eyebrow color={C.blue}>Distritos</Eyebrow><div style={{fontFamily:"Sora,sans-serif",fontSize:17,fontWeight:600,color:C.ink,marginTop:2}}>{rows.length} distritos no escopo</div></div></div>
        <div style={{display:"flex",flexDirection:"column",gap:14,maxHeight:560,overflowY:"auto"}}>
          {rows.map(({d,bat,est,nIg,pct})=>(
            <div key={d.id} style={{borderBottom:`1px solid ${C.line}`,paddingBottom:12}}>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"baseline",marginBottom:6}}>
                <span style={{fontSize:14.5,fontWeight:700,color:C.ink}}>{d.nome}</span>
                {!lockRegiaoId && rById[d.regiaoId] && <span style={{fontSize:11.5,color:C.faint}}>· {rById[d.regiaoId].nome}</span>}
                <span style={{marginLeft:"auto",fontSize:12.5,color:C.muted}}>{d.pastor||"Pastor a definir"}</span>
              </div>
              <Progress value={bat} goal={d.metaBatismo||1}/>
              <div style={{display:"flex",flexWrap:"wrap",gap:14,marginTop:7,fontSize:12.5,color:C.muted}}>
                <span><strong style={{color:C.ink}}>{bat}</strong> de {d.metaBatismo} batismos · {pct}%</span>
                <span><strong style={{color:C.green}}>{est}</strong> estudos</span>
                <span>{nIg} congregações</span>
              </div>
            </div>))}
        </div>
      </Card>
    </div>
  );
}

/* ===== Visão: Campanhas (somente leitura) ===== */
function CampanhasView({data, filtros, setFiltros, lockRegiaoId}){
  const regiaoId = lockRegiaoId||(filtros&&filtros.regiaoId)||"";
  const distritos = data.distritos.filter(d=>(!regiaoId||d.regiaoId===regiaoId)&&(!(filtros&&filtros.distritoId)||d.id===filtros.distritoId));
  const distIds = new Set(distritos.map(d=>d.id));
  const ids = new Set(data.igrejas.filter(i=>distIds.has(i.distritoId)).map(i=>i.id));
  const cells = batCells(data,ids);
  const realizadoCamp=(c)=>distritos.reduce((acc,d)=>{ const k=`${d.id}:${c}`; if(data.realizado&&data.realizado[k]!=null) return acc+Number(data.realizado[k]); const dids=new Set(data.igrejas.filter(i=>i.distritoId===d.id).map(i=>i.id)); return acc+batCells(data,dids).filter(b=>campanhaDoMes(b.m)===c).reduce((a,b)=>a+bapt(b),0); },0);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <BarraFiltros data={data} filtros={filtros} setFiltros={setFiltros} lockRegiaoId={lockRegiaoId}/>
      <Card>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><Target size={18} color={C.blue}/><div><Eyebrow color={C.blue}>Campanhas</Eyebrow><div style={{fontFamily:"Sora,sans-serif",fontSize:17,fontWeight:600,color:C.ink,marginTop:2}}>Alvo, previsto e realizado</div></div></div>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {CAMPANHAS.map(c=>{
            const real=realizadoCamp(c);
            const alvo=(data.alvosCampanha||{})[c]||0;
            const prev=data.previsoes.filter(p=>p.campanha===c&&distIds.has(p.distritoId)).reduce((a,p)=>a+(Number(p.previsto)||0),0);
            const est=data.formularios.filter(f=>ids.has(f.igrejaId)&&campanhaDoMes(f.mes)===c).reduce((a,f)=>a+estudosTotal(f),0);
            const meta=Math.max(alvo,prev,real,1);
            return (
              <div key={c} style={{borderBottom:`1px solid ${C.line}`,paddingBottom:14}}>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"baseline",marginBottom:7}}>
                  <span style={{fontSize:14.5,fontWeight:700,color:C.blue}}>{c}</span>
                  <span style={{fontSize:11.5,color:C.faint}}>{periodoCampanha(c)}</span>
                  <span style={{marginLeft:"auto",fontSize:12.5,color:C.muted}}>Alvo (presidência): <strong style={{color:C.ink}}>{alvo>0?alvo:"a definir"}</strong></span>
                </div>
                <Progress value={real} goal={meta} tint={C.green}/>
                <div style={{display:"flex",flexWrap:"wrap",gap:14,marginTop:7,fontSize:12.5,color:C.muted}}>
                  <span>Realizado <strong style={{color:C.green}}>{real}</strong></span>
                  <span>Previsto <strong style={{color:C.ink}}>{prev}</strong></span>
                  <span>Estudos <strong style={{color:C.ink}}>{est}</strong></span>
                </div>
              </div>);
          })}
        </div>
      </Card>
    </div>
  );
}

/* ===== Visão: Preenchimentos recebidos (presidente/departamental, leitura) ===== */
function PreenchimentosView({data, filtros, setFiltros, lockRegiaoId}){
  const Q=useMemo(()=>makeQueries(data),[data]);
  const dById=useMemo(()=>Object.fromEntries(data.distritos.map(d=>[d.id,d])),[data]);
  const rById=useMemo(()=>Object.fromEntries(data.regioes.map(r=>[r.id,r])),[data]);
  const regiaoId = lockRegiaoId||(filtros&&filtros.regiaoId)||"";
  let forms=(data.formularios||[]).filter(f=>{ const ig=Q.igById[f.igrejaId]; if(!ig)return false; const dist=dById[ig.distritoId]; if(filtros&&filtros.distritoId) return ig.distritoId===filtros.distritoId; if(regiaoId) return dist&&dist.regiaoId===regiaoId; return true; });
  forms=forms.slice().sort((a,b)=>(String(b.data||"")).localeCompare(String(a.data||""))||String(b.id).localeCompare(String(a.id)));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <BarraFiltros data={data} filtros={filtros} setFiltros={setFiltros} lockRegiaoId={lockRegiaoId}/>
      <Card>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <ClipboardList size={18} color={C.blue}/>
          <div><Eyebrow color={C.blue}>Preenchimentos dos distritos</Eyebrow><div style={{fontFamily:"Sora,sans-serif",fontSize:17,fontWeight:600,color:C.ink,marginTop:2}}>{forms.length} relatórios recebidos</div></div>
        </div>
        {forms.length===0 ? <Empty texto="Nenhum preenchimento recebido no escopo."/> : (
          <div style={{display:"flex",flexDirection:"column",gap:10,maxHeight:600,overflowY:"auto"}}>
            {forms.map(f=>{ const ig=Q.igById[f.igrejaId]; const dist=dById[ig.distritoId]; const reg=rById[dist&&dist.regiaoId]; return (
              <div key={f.id} style={{border:`1px solid ${C.line}`,borderRadius:12,padding:14}}>
                <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:8}}>
                  <div style={{minWidth:0,marginRight:"auto",display:"flex",alignItems:"center",gap:7}}><div style={{fontSize:14.5,fontWeight:700,color:C.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ig.nome}</div><TipoTag tipo={tipoDe(ig)}/></div>
                  <span style={{fontSize:12,fontWeight:700,color:C.blue,background:C.blueSoft,padding:"4px 10px",borderRadius:99}}>{f.mes?MES[f.mes-1]:""}{f.ano?`/${f.ano}`:""}</span>
                  <span style={{fontSize:11.5,color:C.faint}}>{f.data}</span>
                </div>
                <div style={{fontSize:12,color:C.muted,marginTop:6}}>{dist?dist.nome:"—"}{reg?` · ${reg.nome}`:""}</div>
                <div style={{display:"grid",gap:8,gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",marginTop:12,paddingTop:12,borderTop:`1px solid ${C.line}`}}>
                  <Mini label="Duplas" value={f.duplas}/><Mini label="Interessados (duplas)" value={f.estudosDuplas}/><Mini label="Classes" value={f.classes}/><Mini label="Interessados (classes)" value={f.estudosClasses}/><Mini label="Interessados (outras)" value={f.estudosOutras}/><Mini label="Total interessados" value={estudosTotal(f)}/>
                </div>
              </div>); })}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ===== Hub do departamental / presidente (somente leitura) ===== */
function HubRegiao({data,filtros,setFiltros,lockRegiaoId}){
  const [sub,setSub]=useState("painel");
  const tabs=[{id:"painel",label:"Painel",icon:TrendingUp},{id:"ranking",label:"Ranking",icon:BarChart3},{id:"distritos",label:"Distritos",icon:Map},{id:"preenchimentos",label:"Preenchimentos",icon:ClipboardList},{id:"campanhas",label:"Campanhas",icon:Target}];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div className="tabscroll" style={{display:"flex",gap:8,overflowX:"auto",flexWrap:"nowrap",paddingBottom:2,marginBottom:4,WebkitOverflowScrolling:"touch"}}>
        {tabs.map(t=>(<button key={t.id} onClick={()=>setSub(t.id)} style={{flexShrink:0,whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:7,padding:"9px 14px",borderRadius:10,cursor:"pointer",fontSize:13.5,fontWeight:600,border:`1px solid ${sub===t.id?C.blueDark:C.line}`,background:sub===t.id?C.grad:"#fff",color:sub===t.id?"#fff":C.muted,boxShadow:sub===t.id?"0 4px 12px rgba(14,58,102,.18)":"none"}}><t.icon size={15}/>{t.label}</button>))}
      </div>
      {sub==="painel"&&<PainelLideranca data={data} lockRegiaoId={lockRegiaoId} filtros={filtros} setFiltros={setFiltros} vista="painel"/>}
      {sub==="ranking"&&<PainelLideranca data={data} lockRegiaoId={lockRegiaoId} filtros={filtros} setFiltros={setFiltros} vista="ranking"/>}
      {sub==="distritos"&&<DistritosView data={data} lockRegiaoId={lockRegiaoId} filtros={filtros} setFiltros={setFiltros}/>}
      {sub==="preenchimentos"&&<PreenchimentosView data={data} lockRegiaoId={lockRegiaoId} filtros={filtros} setFiltros={setFiltros}/>}
      {sub==="campanhas"&&<CampanhasView data={data} lockRegiaoId={lockRegiaoId} filtros={filtros} setFiltros={setFiltros}/>}
    </div>
  );
}

/* ============ TELA DE ACESSO ============ */
const linkBtn={background:"none",border:"none",cursor:"pointer",fontSize:13,color:C.blue,fontWeight:600,textDecoration:"underline",padding:0};
const FUNC_LABEL={presidente:"Presidente",departamental:"Departamental",distrital:"Distrital",desenvolvedor:"Desenvolvedor",lider:"Líder de Igreja"};

function Acesso({data,setData,onLogin,onLider}){
  const [tela,setTela]=useState("login");
  const [erro,setErro]=useState("");
  const [email,setEmail]=useState(""); const [senha,setSenha]=useState("");
  const [f,setF]=useState({nome:"",email:"",funcao:"distrital",regiaoId:"",distritoId:"",senha:"",pergunta:"",resposta:""});
  const updF=(k,v)=>setF(p=>{ const n={...p,[k]:v}; if(k==="funcao"){n.regiaoId="";n.distritoId="";} if(k==="regiaoId"){n.distritoId="";}
    if(k==="nome"){ const alvo=(v||"").trim().toLowerCase(); const dist=alvo?data.distritos.find(d=>(d.pastor||"").trim().toLowerCase()===alvo):null; if(dist){ n.funcao="distrital"; n.regiaoId=dist.regiaoId; const ocupado=(data.usuarios||[]).some(u=>u.funcao==="distrital"&&u.autorizado&&u.distritoId===dist.id); n.distritoId=ocupado?"":dist.id; } }
    return n; });
  const [rec,setRec]=useState({u:null,resp:"",nova:""});
  const usuarios=data.usuarios||[];

  function entrar(){ setErro(""); const u=usuarios.find(x=>(x.email||"").toLowerCase()===email.trim().toLowerCase()); if(!u||u.senha!==senha){setErro("E-mail ou senha incorretos.");return;} if(!u.autorizado){setErro("Cadastro aguardando autorização do desenvolvedor.");return;} onLogin(u); }
  function cadastrar(){ setErro("");
    if(!f.nome.trim()||!f.email.trim()||!f.senha){setErro("Preencha nome, e-mail e senha.");return;}
    if(f.nome.trim().split(/\s+/).length<2){setErro("Digite o nome completo do pastor.");return;}
    if(usuarios.some(u=>(u.email||"").toLowerCase()===f.email.trim().toLowerCase())){setErro("Já existe cadastro com este e-mail.");return;}
    if(f.funcao!=="presidente"&&!f.regiaoId){setErro("Escolha a região.");return;}
    if(f.funcao==="distrital"&&!f.distritoId){setErro("Escolha o distrito.");return;}
    if(f.funcao==="distrital"&&distritosOcupados.has(f.distritoId)){setErro("Este distrito já possui um distrital autorizado.");return;}
    const novo={id:"u"+Date.now(),nome:f.nome.trim(),email:f.email.trim().toLowerCase(),funcao:f.funcao,regiaoId:f.funcao==="presidente"?"":f.regiaoId,distritoId:f.funcao==="distrital"?f.distritoId:"",senha:f.senha,perguntaChave:f.pergunta.trim(),respostaChave:f.resposta.trim(),autorizado:false};
    setData(d=>({...d,usuarios:[...(d.usuarios||[]),novo]})); setTela("enviado");
  }
  function buscarRec(){ setErro(""); const u=usuarios.find(x=>(x.email||"").toLowerCase()===email.trim().toLowerCase()); if(!u){setErro("E-mail não encontrado.");return;} if(!u.perguntaChave){setErro("Sem pergunta-chave neste cadastro. Procure o desenvolvedor.");return;} setRec({u,resp:"",nova:""}); }
  function redefinir(){ setErro(""); if(rec.resp.trim().toLowerCase()!==(rec.u.respostaChave||"").toLowerCase()){setErro("Resposta incorreta.");return;} if(!rec.nova){setErro("Digite a nova senha.");return;} setData(d=>({...d,usuarios:d.usuarios.map(u=>u.id===rec.u.id?{...u,senha:rec.nova}:u)})); setRec({u:null,resp:"",nova:""}); setSenha(""); setErro("Senha redefinida. Faça login."); setTela("login"); }

  const distritosOcupados = new Set((data.usuarios||[]).filter(u=>u.funcao==="distrital"&&u.autorizado&&u.distritoId).map(u=>u.distritoId));
  const distritosReg=data.distritos.filter(d=>d.regiaoId===f.regiaoId && !distritosOcupados.has(d.id));
  const wrap=(child,maxW=420)=>(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"Inter, system-ui, sans-serif",color:C.ink,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 18px"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Inter:wght@400;500;600&display=swap'); *{box-sizing:border-box;} button,input,select{font-family:inherit;}`}</style>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,marginBottom:20,textAlign:"center"}}>
        <SeloCRM size={56}/>
        <div style={{display:"flex",gap:7,fontSize:10.5,fontWeight:600,letterSpacing:".16em",color:C.blueLight,marginTop:8}}><span>COMUNHÃO</span><span style={{color:C.line}}>·</span><span>RELACIONAMENTO</span><span style={{color:C.line}}>·</span><span>MISSÃO</span></div>
        <div style={{fontFamily:"Sora,sans-serif",fontSize:24,fontWeight:700,color:C.ink}}>Projeto 200 <span style={{color:C.faint,fontWeight:600,fontSize:17}}>· CRM</span></div>
        <div style={{fontSize:13,color:C.muted}}>Associação Pernambucana Central</div>
      </div>
      <div style={{width:"100%",maxWidth:maxW}}>
        {child}
        {erro && <div style={{marginTop:12,fontSize:13,fontWeight:600,color:erro.startsWith("Senha redefinida")?C.green:"#C0392B",textAlign:"center"}}>{erro}</div>}
      </div>
    </div>
  );

  if(tela==="enviado") return wrap(
    <Card style={{textAlign:"center"}}>
      <div style={{width:52,height:52,borderRadius:99,background:C.greenSoft,display:"grid",placeItems:"center",margin:"0 auto 14px"}}><Check size={26} color={C.green}/></div>
      <div style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:700,color:C.ink}}>Cadastro enviado</div>
      <p style={{fontSize:13.5,color:C.muted,margin:"8px 0 16px"}}>Aguarde a autorização do desenvolvedor. Depois você entra com seu e-mail e senha.</p>
      <Btn variant="ghost" onClick={()=>{setTela("login");setErro("");}}>Voltar ao login</Btn>
    </Card>
  );

  if(tela==="recuperar") return wrap(
    <Card>
      <div style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:700,color:C.ink,marginBottom:14}}>Recuperar senha</div>
      {!rec.u ? (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Field label="E-mail do cadastro"><input value={email} onChange={e=>setEmail(e.target.value)} style={inputStyle} placeholder="seu@email"/></Field>
          <Btn onClick={buscarRec}>Continuar</Btn>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div><div style={{fontSize:12.5,color:C.muted}}>Pergunta-chave</div><div style={{fontSize:14,fontWeight:600,color:C.ink,marginTop:2}}>{rec.u.perguntaChave}</div></div>
          <Field label="Resposta"><input value={rec.resp} onChange={e=>setRec(r=>({...r,resp:e.target.value}))} style={inputStyle}/></Field>
          <Field label="Nova senha"><input type="password" value={rec.nova} onChange={e=>setRec(r=>({...r,nova:e.target.value}))} style={inputStyle}/></Field>
          <Btn onClick={redefinir}>Redefinir senha</Btn>
        </div>
      )}
      <div style={{marginTop:14,textAlign:"center"}}><button onClick={()=>{setTela("login");setErro("");setRec({u:null,resp:"",nova:""});}} style={linkBtn}>Voltar ao login</button></div>
    </Card>
  );

  if(tela==="cadastro") return wrap(
    <Card>
      <div style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:700,color:C.ink,marginBottom:14}}>Criar cadastro</div>
      <div style={{display:"grid",gap:12,gridTemplateColumns:"1fr 1fr"}}>
        <div style={{gridColumn:"1 / -1"}}><Field label="Nome completo"><input value={f.nome} onChange={e=>updF("nome",e.target.value)} style={inputStyle} placeholder="Nome e sobrenome do pastor"/></Field><div style={{fontSize:11.5,color:C.faint,marginTop:5}}>Digite o nome como consta no ACMS — região e distrito são preenchidos automaticamente.</div></div>
        <div style={{gridColumn:"1 / -1"}}><Field label="E-mail"><input value={f.email} onChange={e=>updF("email",e.target.value)} style={inputStyle}/></Field></div>
        <Field label="Função"><Select value={f.funcao} onChange={e=>updF("funcao",e.target.value)}><option value="presidente">Presidente</option><option value="departamental">Departamental</option><option value="distrital">Distrital</option></Select></Field>
        {f.funcao!=="presidente" && <Field label="Região"><Select value={f.regiaoId} onChange={e=>updF("regiaoId",e.target.value)}><option value="">Selecione…</option>{data.regioes.map(r=><option key={r.id} value={r.id}>{r.nome}</option>)}</Select></Field>}
        {f.funcao==="distrital" && <div style={{gridColumn:"1 / -1"}}><Field label="Distrito (filtrado pela região)"><Select value={f.distritoId} disabled={!f.regiaoId} onChange={e=>updF("distritoId",e.target.value)}><option value="">{f.regiaoId?"Selecione…":"Escolha a região primeiro"}</option>{distritosReg.map(d=><option key={d.id} value={d.id}>{d.nome}</option>)}</Select></Field></div>}
        <Field label="Senha"><input type="password" value={f.senha} onChange={e=>updF("senha",e.target.value)} style={inputStyle}/></Field>
        <Field label="Pergunta-chave"><input value={f.pergunta} onChange={e=>updF("pergunta",e.target.value)} style={inputStyle} placeholder="Ex.: nome do meu pet"/></Field>
        <div style={{gridColumn:"1 / -1"}}><Field label="Resposta da pergunta-chave"><input value={f.resposta} onChange={e=>updF("resposta",e.target.value)} style={inputStyle}/></Field></div>
      </div>
      <div style={{marginTop:16}}><Btn onClick={cadastrar}>Enviar cadastro</Btn></div>
      <div style={{marginTop:14,textAlign:"center"}}><button onClick={()=>{setTela("login");setErro("");}} style={linkBtn}>Já tenho cadastro — entrar</button></div>
    </Card>, 520
  );

  return wrap(
    <Card>
      <div style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:700,color:C.ink,marginBottom:14}}>Entrar</div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <Field label="E-mail"><input value={email} onChange={e=>setEmail(e.target.value)} style={inputStyle} placeholder="seu@email"/></Field>
        <Field label="Senha"><input type="password" value={senha} onChange={e=>setSenha(e.target.value)} style={inputStyle} onKeyDown={e=>e.key==="Enter"&&entrar()}/></Field>
        <Btn onClick={entrar}>Entrar</Btn>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:14,gap:10,flexWrap:"wrap"}}>
        <button onClick={()=>{setTela("cadastro");setErro("");}} style={linkBtn}>Criar cadastro</button>
        <button onClick={()=>{setTela("recuperar");setErro("");}} style={linkBtn}>Esqueci a senha</button>
      </div>
      <div style={{marginTop:16,borderTop:`1px solid ${C.line}`,paddingTop:14,textAlign:"center"}}>
        <div style={{fontSize:11.5,color:C.faint}}>Associação Pernambucana Central · Projeto 200</div>
      </div>
    </Card>
  );
}

/* ===== Desenvolvedor: autorização de acessos ===== */
function AcessosPresidente({data,setData}){
  const usuarios=data.usuarios||[];
  const pend=usuarios.filter(u=>!u.autorizado);
  const ativos=usuarios.filter(u=>u.autorizado);
  const autorizar=(id)=>setData(d=>({...d,usuarios:d.usuarios.map(u=>u.id===id?{...u,autorizado:true}:u)}));
  const revogar=(id)=>setData(d=>({...d,usuarios:d.usuarios.map(u=>u.id===id?{...u,autorizado:false}:u)}));
  const remover=(id)=>setData(d=>({...d,usuarios:d.usuarios.filter(u=>u.id!==id)}));
  const escopo=(u)=>{ if(u.funcao==="presidente")return"Todas as regiões"; if(u.funcao==="desenvolvedor")return"Acesso total"; if(u.funcao==="departamental")return(data.regioes.find(r=>r.id===u.regiaoId)||{}).nome||"—"; if(u.funcao==="distrital"){const dd=data.distritos.find(x=>x.id===u.distritoId)||{};const rg=data.regioes.find(r=>r.id===dd.regiaoId)||{};return `${dd.nome||"—"} · ${rg.nome||""}`;} return ""; };
  const Linha=({u,acoes})=>(
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${C.line}`,flexWrap:"wrap"}}>
      <div style={{minWidth:0,flex:1}}>
        <div style={{fontSize:14,fontWeight:700,color:C.ink}}>{u.nome} <span style={{fontSize:11.5,fontWeight:600,color:C.blue,background:C.blueSoft,padding:"2px 8px",borderRadius:99,marginLeft:6}}>{FUNC_LABEL[u.funcao]||u.funcao}</span></div>
        <div style={{fontSize:12.5,color:C.muted,marginTop:2}}>{u.email} · {escopo(u)}</div>
      </div>
      {acoes}
    </div>
  );
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <Card>
        <Eyebrow color={C.blue}>Acessos</Eyebrow>
        <div style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:600,color:C.ink,margin:"2px 0 6px"}}>Cadastros aguardando autorização</div>
        <p style={{fontSize:13,color:C.muted,marginBottom:12}}>Autorize para liberar o login. Se algo estiver errado, recuse — a pessoa refaz o cadastro.</p>
        {pend.length===0? <Empty texto="Nenhum cadastro pendente."/> : pend.map(u=>(
          <Linha key={u.id} u={u} acoes={<div style={{display:"flex",gap:8}}><Btn small icon={Check} onClick={()=>autorizar(u.id)}>Autorizar</Btn><Btn small variant="ghost" onClick={()=>remover(u.id)}>Recusar</Btn></div>}/>
        ))}
      </Card>
      <Card>
        <div style={{fontFamily:"Sora,sans-serif",fontSize:16,fontWeight:600,color:C.ink,marginBottom:8}}>Acessos ativos ({ativos.length})</div>
        {ativos.length===0? <Empty texto="Nenhum acesso ativo."/> : ativos.map(u=>(
          <Linha key={u.id} u={u} acoes={u.funcao==="desenvolvedor"? <span style={{fontSize:12,color:C.faint}}>—</span> : <div style={{display:"flex",gap:8}}><Btn small variant="ghost" onClick={()=>revogar(u.id)}>Revogar</Btn><Btn small variant="ghost" onClick={()=>remover(u.id)}>Remover</Btn></div>}/>
        ))}
      </Card>
    </div>
  );
}

/* ============ APP ============ */
/* ===== Link público do líder (via WhatsApp) ===== */
function parseHash(){
  const h=(typeof window!=="undefined" ? window.location.hash : "").replace(/^#/,"");
  const parts=h.split("/").filter(Boolean);
  if(parts[0]==="f" && parts.length>=2) return {tipo:"form", igrejaId:decodeURIComponent(parts[parts.length-1])};
  return {tipo:"app"};
}

function FormPublico({data,setData,igrejaId}){
  const ig=data.igrejas.find(i=>i.id===igrejaId);
  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"Inter, system-ui, sans-serif",color:C.ink}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Inter:wght@400;500;600&display=swap'); *{box-sizing:border-box;} select,input,textarea,button{font-family:inherit;}`}</style>
      <div style={{height:3,background:C.grad}}/>
      <div style={{maxWidth:640,margin:"0 auto",padding:"22px 16px 40px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
          <SeloCRM/>
          <div>
            <div style={{display:"flex",gap:6,fontSize:10,fontWeight:600,letterSpacing:".14em",color:C.blueLight}}><span>COMUNHÃO</span><span style={{color:C.line}}>·</span><span>RELACIONAMENTO</span><span style={{color:C.line}}>·</span><span>MISSÃO</span></div>
            <div style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:700,color:C.blueDark}}>Projeto 200</div>
          </div>
        </div>
        {ig
          ? <FormularioLider data={data} setData={setData} igrejaFixa={igrejaId}/>
          : <Card><div style={{fontFamily:"Sora,sans-serif",fontSize:16,fontWeight:600,color:C.ink}}>Link inválido</div><p style={{fontSize:13.5,color:C.muted,marginTop:6}}>Esta igreja/grupo não foi encontrada. Peça um novo link ao seu pastor distrital.</p></Card>}
      </div>
    </div>
  );
}

export default function App(){
  const [data,setDataState]=useState(null);
  const [usuario,setUsuario]=useState(null);
  const [rota,setRota]=useState(()=>parseHash());
  const [filtros,setFiltros]=useState({regiaoId:"",distritoId:"",igrejaId:"",tipo:"",mes:"Todos",campanha:"Todas"});

  useEffect(()=>{ const h=()=>setRota(parseHash()); window.addEventListener("hashchange",h); return ()=>window.removeEventListener("hashchange",h); },[]);
  useEffect(()=>{ (async()=>{ const d=await load(); if(d) setDataState(d); else { const s=buildInitial(); setDataState(s); persist(s);} })(); },[]);
  useEffect(()=>{ if(usuario && usuario.funcao==="departamental") setFiltros(f=>({...f,regiaoId:usuario.regiaoId})); },[usuario]);
  function setData(up){ setDataState(prev=>{ const next=typeof up==="function"?up(prev):up; persist(next); return next; }); }

  if(!data) return <div style={{minHeight:"100vh",display:"grid",placeItems:"center",background:C.bg,fontFamily:"Inter,sans-serif",color:C.muted}}>Carregando…</div>;
  if(rota.tipo==="form") return <FormPublico data={data} setData={setData} igrejaId={rota.igrejaId}/>;
  if(!usuario) return <Acesso data={data} setData={setData} onLogin={(u)=>setUsuario(u)} onLider={()=>setUsuario({funcao:"lider",nome:"Líder de igreja"})}/>;

  const papel=usuario.funcao;
  const papeis=[{id:"desenvolvedor",label:"Desenvolvedor",icon:Wrench},{id:"presidente",label:"Presidente",icon:Crown},{id:"departamental",label:"Departamental",icon:Map},{id:"distrital",label:"Distrital",icon:UserCog},{id:"lider",label:"Líder de Igreja",icon:ClipboardList}];

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"Inter, system-ui, sans-serif",color:C.ink}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        *{box-sizing:border-box;} select,input,textarea,button{font-family:inherit;}
        button:focus-visible,select:focus-visible,input:focus-visible,textarea:focus-visible{outline:2px solid ${C.blueLight};outline-offset:2px;}
        ::-webkit-scrollbar{height:8px;width:8px;} ::-webkit-scrollbar-thumb{background:${C.line};border-radius:99px;}
        .tabscroll{scrollbar-width:none;-ms-overflow-style:none;} .tabscroll::-webkit-scrollbar{display:none;}
      `}</style>

      <header style={{background:"#fff",borderBottom:`1px solid ${C.line}`,boxShadow:"0 2px 14px rgba(14,58,102,.06)",position:"sticky",top:0,zIndex:20}}>
        <div style={{height:3,background:C.grad}}/>
        <div style={{maxWidth:1080,margin:"0 auto",padding:"14px 18px",display:"flex",alignItems:"center",gap:14}}>
          <SeloCRM/>
          <div style={{marginRight:"auto"}}>
            <div style={{display:"flex",gap:7,fontSize:10.5,fontWeight:600,letterSpacing:".16em",color:C.blueLight}}><span>COMUNHÃO</span><span style={{color:C.line}}>·</span><span>RELACIONAMENTO</span><span style={{color:C.line}}>·</span><span>MISSÃO</span></div>
            <div style={{fontFamily:"Sora,sans-serif",fontSize:19,fontWeight:700,color:C.blueDark,lineHeight:1.1}}>Projeto 200 <span style={{color:C.faint,fontWeight:600,fontSize:14}}>· CRM</span></div>
          </div>
        </div>
        <div style={{maxWidth:1080,margin:"0 auto",padding:"0 18px 12px",display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          {(()=>{ const cur=papeis.find(p=>p.id===papel)||papeis[0]; return <span style={{display:"inline-flex",alignItems:"center",gap:7,fontSize:13,fontWeight:600,color:"#fff",background:C.grad,padding:"7px 13px",borderRadius:99,boxShadow:"0 3px 10px rgba(14,58,102,.2)"}}><cur.icon size={15}/>{cur.label}</span>; })()}
          <span style={{fontSize:13,color:C.muted,fontWeight:600}}>{usuario.nome}</span>
          <button onClick={()=>setUsuario(null)} style={{marginLeft:"auto",display:"inline-flex",alignItems:"center",gap:6,padding:"7px 13px",borderRadius:99,cursor:"pointer",fontSize:13,fontWeight:600,border:`1px solid ${C.line}`,background:"#fff",color:C.muted}}>Sair</button>
        </div>
      </header>

      <main style={{maxWidth:1080,margin:"0 auto",padding:"20px 18px 60px"}}>
        {papel==="departamental" && (()=>{ const reg=data.regioes.find(r=>r.id===usuario.regiaoId)||{}; return (
          <ContextoBar icon={Map} texto={`Região: ${reg.nome||"—"} · Departamental: ${reg.departamental||usuario.nome}`}/>
        ); })()}
        {papel==="distrital" && (()=>{ const dd=data.distritos.find(d=>d.id===usuario.distritoId)||{}; return (
          <ContextoBar icon={UserCog} texto={`Distrito: ${dd.nome||"—"} · Pastor: ${dd.pastor||usuario.nome}`}/>
        ); })()}

        {papel==="desenvolvedor" && <PresidenteView data={data} setData={setData} filtros={filtros} setFiltros={setFiltros} mostrarAcessos={true}/>}
        {papel==="presidente" && <HubRegiao data={data} filtros={filtros} setFiltros={setFiltros}/>}
        {papel==="departamental" && <HubRegiao data={data} lockRegiaoId={usuario.regiaoId} filtros={filtros} setFiltros={setFiltros}/>}
        {papel==="distrital" && <PainelPastor data={data} setData={setData} distritoId={usuario.distritoId}/>}
        {papel==="lider" && <FormularioLider data={data} setData={setData}/>}

        {papel!=="lider" && <div style={{marginTop:18}}><FeedPreenchimentos data={data} todos={papel==="presidente"||papel==="desenvolvedor"} regiaoId={papel==="departamental"?usuario.regiaoId:null} distritoId={papel==="distrital"?usuario.distritoId:null}/></div>}
      </main>
    </div>
  );
}
