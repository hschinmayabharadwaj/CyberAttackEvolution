from enum import Enum


class AttackCategory(Enum):
    RANSOMWARE = "ransomware"
    APT = "apt"
    PHISHING = "phishing"
    SUPPLY_CHAIN = "supply_chain"
    ZERO_DAY = "zero_day"
    DDOS = "ddos"
    CRYPTOJACKING = "cryptojacking"
    INSIDER_THREAT = "insider_threat"
    IOT_EXPLOIT = "iot_exploit"
    AI_POWERED = "ai_powered"
